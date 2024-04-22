package com.wise.MarketingPlatForm.report.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.Gson;
import com.wise.MarketingPlatForm.data.QueryResultCacheManager;
import com.wise.MarketingPlatForm.data.file.CacheFileWritingTaskExecutorService;
import com.wise.MarketingPlatForm.data.file.SummaryMatrixFileWriterService;
import com.wise.MarketingPlatForm.data.map.MapListDataFrame;
import com.wise.MarketingPlatForm.dataset.domain.cube.vo.CubeInfoDTO;
import com.wise.MarketingPlatForm.dataset.domain.cube.vo.DetailedDataItemVO;
import com.wise.MarketingPlatForm.dataset.service.CubeService;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.fileUpload.service.FileUploadService;
import com.wise.MarketingPlatForm.global.config.MartConfig;
import com.wise.MarketingPlatForm.global.diagnos.WDC;
import com.wise.MarketingPlatForm.global.exception.ServiceTimeoutException;
import com.wise.MarketingPlatForm.login.service.LoginService;
import com.wise.MarketingPlatForm.mart.dao.MartDAO;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.report.dao.ReportDAO;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Dataset;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.Parameter;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.factory.ItemDataMakerFactory;
import com.wise.MarketingPlatForm.report.domain.item.pivot.aggregator.DataAggregator;
import com.wise.MarketingPlatForm.report.domain.item.pivot.model.DataFrame;
import com.wise.MarketingPlatForm.report.domain.item.pivot.model.Paging;
import com.wise.MarketingPlatForm.report.domain.item.pivot.model.PivotDataAggregation;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.FilterParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.GroupParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.PagingParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.SortInfoParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.SummaryParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.TopBottomParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.UdfGroupParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.SummaryMatrix;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.SummaryMatrixFactory;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.SummaryMatrixUtils;
import com.wise.MarketingPlatForm.report.domain.item.pivot.util.ParamUtils;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;
import com.wise.MarketingPlatForm.report.domain.result.result.PivotResult;
import com.wise.MarketingPlatForm.report.domain.store.QueryGenerator;
import com.wise.MarketingPlatForm.report.domain.store.factory.QueryGeneratorFactory;
import com.wise.MarketingPlatForm.report.domain.xml.ReportXMLParser;
import com.wise.MarketingPlatForm.report.domain.xml.factory.XMLParserFactory;
import com.wise.MarketingPlatForm.report.entity.ReportLinkMstrEntity;
import com.wise.MarketingPlatForm.report.entity.ReportLinkSubMstrEntity;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
import com.wise.MarketingPlatForm.report.type.ItemType;
import com.wise.MarketingPlatForm.report.type.EditMode;
import com.wise.MarketingPlatForm.report.type.ItemType;
import com.wise.MarketingPlatForm.report.type.ReportType;
import com.wise.MarketingPlatForm.report.vo.ReportListDTO;
import com.wise.MarketingPlatForm.report.vo.FolderMasterVO;
import com.wise.MarketingPlatForm.report.vo.ReportLinkMstrDTO;
import com.wise.MarketingPlatForm.report.vo.ReportLinkSubMstrDTO;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;
import org.json.JSONArray;
import org.json.JSONObject;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ReportService {

    private final ReportDAO reportDAO;
    private final MartConfig martConfig;
    private final MartDAO martDAO;
    private final DatasetService datasetService;
    private final QueryResultCacheManager queryResultCacheManager;
    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);

    private static final long MAX_CACHEABLE_SUMMARY_MATRIX_SIZE = 100L * 1024L * 1024L; // 100MB

    private static final long DEFAULT_SERVICE_TIME_OUT = 20L * 60L * 1000L; // 20 minutes

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DataAggregator dataAggregator;

    @Autowired
    private SummaryMatrixFileWriterService summaryMatrixFileWriterService;

    @Autowired
    private CacheFileWritingTaskExecutorService cacheFileWritingTaskExecutorService;

    @Autowired
    private XMLParserFactory xmlParserFactory;

    @Autowired
    private FileUploadService fileUploadService;
    
    @Autowired
    private CubeService cubeService;

    ReportService(ReportDAO reportDAO, MartConfig martConfig, MartDAO martDAO, DatasetService datasetService,
            QueryResultCacheManager queryResultCacheManager) {
        this.reportDAO = reportDAO;
        this.martConfig = martConfig;
        this.martDAO = martDAO;
        this.datasetService = datasetService;
        this.queryResultCacheManager = queryResultCacheManager;
    }

    public Map<String, Object> getReport(String reportId, String userId) {
    	Map<String, Object> returnMap = new HashMap<>();
    	try {
    		Gson gson = new Gson();
    		ObjectMapper objectMapper = new ObjectMapper();
    		objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
    		ReportMstrEntity entity = reportDAO.selectReport(reportId);
    		ReportMstrDTO dto = ReportMstrEntity.toDTO(entity);
    		if(!"newReport".equals(dto.getDatasetXml())) {
    			ReportXMLParser reportXmlParser = xmlParserFactory.getXmlParser(dto.getReportType());
    			returnMap = reportXmlParser.getReport(dto, userId);
    		} else {
    			JSONObject items = new JSONObject(objectMapper.readValue(entity.getChartXml(), Map.class));
    			JSONObject dataset = new JSONObject(objectMapper.readValue(entity.getDatasetXml(), Map.class));
    			if (dataset.get("datasets") != null) {
    				JSONArray datasetArray = dataset.getJSONArray("datasets");
    				for (int i= 0; i < datasetArray.length(); i++) {
    					JSONObject datset = datasetArray.getJSONObject(i);
    					if (datset.has("cubeId")) {
    						CubeInfoDTO cubeInfo = cubeService.getCube(datset.get("cubeId").toString(), userId);
    						datset.put("fields", new JSONArray(gson.toJson(cubeInfo.getFields())));
    						datset.put("detailedData", new JSONArray(gson.toJson(cubeInfo.getDetailedData())));
    					}
    				}
    			}
    			JSONObject layout = new JSONObject(entity.getLayoutXml());
    			JSONArray informations = new JSONArray(entity.getParamXml());
    			if(ReportType.EXCEL.toStrList().contains(entity.getReportType())) {
    				JSONObject spread = new JSONObject(entity.getReportXml());
    				returnMap.put("spread", spread.toString());
    			}
    			returnMap.put("item", items.toString());
    			returnMap.put("dataset", dataset.toString());
    			returnMap.put("layout", layout.toString());
    			returnMap.put("informations", informations.toString());
    		}
    		Map<String, Object> report = new HashMap<String, Object>();
    		List<Map<String, Object>> reports = new ArrayList<Map<String, Object>>();
    		
    		Map<String, Object> options = new HashMap<String, Object>();
    		options.put("order", entity.getReportOrdinal());
    		options.put("reportNm", entity.getReportNm());
    		options.put("fldId", entity.getFldId());
    		options.put("fldType", entity.getFldType());
    		options.put("reportType", entity.getReportType());
    		options.put("reportTag", entity.getReportTag());
    		options.put("reportDesc", entity.getReportDesc());
    		options.put("reportSubTitle", entity.getReportSubTitle());
    		options.put("reportPath", null);
    		
    		report.put("reportId", Integer.parseInt(reportId));
    		report.put("options", options);
    		
    		reports.add(report);
    		
    		returnMap.put("reports", reports);
    	} catch (Exception e) {
    		returnMap.put("error", "error");
    	}
    	return returnMap;
    }

    public ReportResult getItemData(DataAggregation dataAggreagtion) {
        ReportResult result;

        QueryGeneratorFactory queryGeneratorFactory = new QueryGeneratorFactory();
        QueryGenerator queryGenerator = queryGeneratorFactory.getDataStore(dataAggreagtion.getDataset().getDsType());

        // TODO: 주제 영역일 경우 다르게 처리 현재는 쿼리 직접 입력만.
        // 추후 쿼리 queryGenerator에 구현
        DsMstrDTO dsMstrDTO = datasetService.getDataSource(dataAggreagtion.getDataset().getDsId());

        // TODO: 추후 DB 암호화 적용시 복호화 로직.
        // try {
        // Aes256Cipher aes256 = Aes256Cipher.getInstance();
        // String pw = aes256.AES_Decode(dsMstrDTO.getPassword());
        // dsMstrDTO.setPassword(pw);
        // } catch (Exception e) {
        // e.printStackTrace();
        // }

        martConfig.setMartDataSource(dsMstrDTO);

        String query = queryGenerator.getQuery(dataAggreagtion);

        MartResultDTO martResultDTO = martDAO.select(dsMstrDTO.getDsId(), query);

        ItemDataMakerFactory itemDataMakerFactory = new ItemDataMakerFactory();
        ItemDataMaker itemDataMaker = itemDataMakerFactory.getItemDataMaker(dataAggreagtion.getItemType());

        result = itemDataMaker.make(dataAggreagtion, martResultDTO.getRowData());

        return result;
    }

    public ReportResult getPivotData(final Map<String, String> param, final PagingParam pagingParam,
            DataAggregation dataAggreagtion) throws Exception {
        final SummaryMatrix matrix = getPivotSummaryMatrix(param, pagingParam, dataAggreagtion);

        if (matrix == null) {
            return null;
        }

        final Paging paging = new Paging();
        paging.setOffset(pagingParam.getOffset());
        paging.setLimit(pagingParam.getLimit());

        final SummaryMatrix pagedMatrix;

        if (!paging.isPagingEnabled() || (paging.getOffset() == 0 && matrix.getRows() <= paging.getLimit())) {
            pagedMatrix = matrix;
        } else {
            pagedMatrix = SummaryMatrixFactory.slicePageSummaryMatrix(matrix, paging);
        }

        PivotResult result = new PivotResult();

        result.setMatrix(pagedMatrix);
        return result;
    }

    public Map<String, ReportResult> getAdHocItemData(DataAggregation dataAggreagtion) {
        Map<String, ReportResult> result = new HashMap<String, ReportResult>();

        QueryGeneratorFactory queryGeneratorFactory = new QueryGeneratorFactory();
        QueryGenerator queryGenerator = queryGeneratorFactory.getDataStore(dataAggreagtion.getDataset().getDsType());

        DsMstrDTO dsMstrDTO = datasetService.getDataSource(dataAggreagtion.getDataset().getDsId());

        martConfig.setMartDataSource(dsMstrDTO);

        String query = queryGenerator.getQuery(dataAggreagtion);
        String layoutType = dataAggreagtion.getAdHocOption().getLayoutSetting();
        String[] items = layoutType.split("_");

        MartResultDTO martResultDTO = martDAO.select(dsMstrDTO.getDsId(), query);
        List<Map<String, Object>> chartRowData = martResultDTO.getRowData();
        ItemDataMakerFactory itemDataMakerFactory = new ItemDataMakerFactory();

        for (String item : items) {
            ItemDataMaker dataMaker = itemDataMakerFactory.getItemDataMaker(ItemType.fromString(item).get());
            List<Map<String, Object>> rowData = martResultDTO.deepCloneList(chartRowData);
            result.put(item, dataMaker.make(dataAggreagtion, rowData));
        }

        return result;
    }

    public SummaryMatrix getPivotSummaryMatrix(final Map<String, String> allParameters, final PagingParam pagingParam,
            DataAggregation dataAggregation) throws Exception {
        final String sqlLikeOption = allParameters.get("dataset");
        final String filter = allParameters.get("filter");
        final String udfGroups = allParameters.get("udfGroups");
        final String group = allParameters.get("group").toString();
        final String groupSummary = allParameters.get("groupSummary");
        final String totalSummary = allParameters.get("totalSummary");
        final String sortInfo = allParameters.get("sortInfo");
        final String topBottom = allParameters.get("topBottom");

        final String argsInfo = new StringBuilder(1024).append(sqlLikeOption).append(':').append(filter).append(':')
                .append(udfGroups).append(':').append(group).append(':').append(groupSummary).append(':')
                .append(totalSummary).append(sortInfo).append(topBottom).append(':').toString();

        final String cacheKey = DigestUtils.sha256Hex(argsInfo);

        final SummaryMatrix cachedSummaryMatrix = getPivotSummaryMatrixFromCache(cacheKey);

        if (cachedSummaryMatrix != null) {
            return cachedSummaryMatrix;
        }

        final ArrayNode filterParamsNode = StringUtils.isNotBlank(filter) ? (ArrayNode) objectMapper.readTree(filter)
                : null;
        final FilterParam rootFilter = ParamUtils.toFilterParam(filterParamsNode);

        final ArrayNode udfGroupParamsNode = StringUtils.isNotBlank(udfGroups)
                ? (ArrayNode) objectMapper.readTree(udfGroups)
                : null;
        final List<UdfGroupParam> udfGroupParams = ParamUtils.toUdfGroupParams(objectMapper, udfGroupParamsNode);

        final ArrayNode groupParamsNode = StringUtils.isNotBlank(group) ? (ArrayNode) objectMapper.readTree(group)
                : null;
        final List<GroupParam> groupParams = ParamUtils.toGroupParams(objectMapper, groupParamsNode);
        final int groupParamCount = groupParams.size();

        final ArrayNode groupSummaryParamsNode = StringUtils.isNotBlank(groupSummary)
                ? (ArrayNode) objectMapper.readTree(groupSummary)
                : null;
        final List<SummaryParam> groupSummaryParams = ParamUtils.toSummaryParams(objectMapper, groupSummaryParamsNode);

        final ArrayNode totalSummaryParamsNode = StringUtils.isNotBlank(totalSummary)
                ? (ArrayNode) objectMapper.readTree(totalSummary)
                : null;
        final List<SummaryParam> totalSummaryParams = ParamUtils.toSummaryParams(objectMapper, totalSummaryParamsNode);

        final ArrayNode sortInfoParamsNode = StringUtils.isNotBlank(sortInfo)
                ? (ArrayNode) objectMapper.readTree(sortInfo)
                : null;
        final List<SortInfoParam> sortInfoParams = ParamUtils.toSortInfoParams(objectMapper, sortInfoParamsNode);

        final ObjectNode topBottomParamNode = StringUtils.isNotBlank(topBottom)
                ? (ObjectNode) objectMapper.readTree(topBottom)
                : null;
        final TopBottomParam topBottomParam = ParamUtils.toTopBottomParam(objectMapper, topBottomParamNode);

        final List<GroupParam> rowGroupParams = pagingParam.getRowGroupParams();
        final int rowGroupParamCount = rowGroupParams.size();
        final List<GroupParam> colGroupParams = new ArrayList<>();

        boolean isFullyExpandedGroups = true;

        for (int i = 0; i < groupParamCount; i++) {
            final GroupParam groupParam = groupParams.get(i);
            if (i < rowGroupParamCount) {
                final GroupParam rowGroupParam = rowGroupParams.get(i);
                if (!StringUtils.equals(groupParam.getKey(), rowGroupParam.getKey())) {
                    isFullyExpandedGroups = false;
                    break;
                }
            } else {
                colGroupParams.add(groupParam);
            }
        }

        if (!isFullyExpandedGroups) {
            return null;
        }

        CommonResult orgData = (CommonResult) getItemData(dataAggregation);

        final List<Map<String, Object>> dataArray = orgData.getData();
        checkServiceTimeout();
        final List<String> colNames = dataArray != null && dataArray.size() > 0
                ? new ArrayList<>(dataArray.get(0).keySet())
                : Collections.emptyList();

        final DataFrame dataFrame = new MapListDataFrame(dataArray, colNames.toArray(new String[colNames.size()]));

        final PivotDataAggregation aggregation = dataAggregator.createDataAggregation(dataFrame, rootFilter,
                udfGroupParams,
                groupParams, groupSummaryParams, totalSummaryParams, null, null, topBottomParam);
        checkServiceTimeout();

        final SummaryMatrix matrix = SummaryMatrixFactory.createSummaryMatrixFromFullyExpandedDataAggregation(
                aggregation, rowGroupParams, colGroupParams, groupSummaryParams, sortInfoParams);

        if (matrix != null) {
            putPivotSummaryMatrixToCache(cacheKey, matrix);
        }

        return matrix;
    }

    private SummaryMatrix getPivotSummaryMatrixFromCache(final String cacheKey) {
        SummaryMatrix matrix = null;

        try {
            JsonNode matrixNode = (JsonNode) queryResultCacheManager.getSummaryMatrixCache(cacheKey);

            if (matrixNode != null) {
                matrix = SummaryMatrixUtils.readSummaryMatrixFromJson(objectMapper, matrixNode);
            }

            if (matrix == null) {
                final String relDirPath = DateFormatUtils.format(new Date(), "yyyyMMdd");
                final File cacheFile = summaryMatrixFileWriterService.getSummaryMatrixFile(cacheKey, relDirPath);

                if (cacheFile != null && cacheFile.isFile()) {
                    try (FileInputStream fis = new FileInputStream(cacheFile);
                            InputStreamReader isr = new InputStreamReader(fis, StandardCharsets.UTF_8);
                            BufferedReader br = new BufferedReader(isr)) {
                        matrixNode = objectMapper.readTree(br);

                        final long fileLen = cacheFile.length();
                        if (fileLen < MAX_CACHEABLE_SUMMARY_MATRIX_SIZE) {
                            queryResultCacheManager.putSummaryMatrixCache(cacheKey, matrixNode);
                        }

                        matrix = SummaryMatrixUtils.readSummaryMatrixFromJson(objectMapper, matrixNode);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Failed to get summary matrix from the cache.", e);
        }

        return matrix;
    }

    private void putPivotSummaryMatrixToCache(final String cacheKey, final SummaryMatrix matrix) {
        try {
            final String relDirPath = DateFormatUtils.format(new Date(), "yyyyMMdd");
            final File cacheFile = summaryMatrixFileWriterService.getSummaryMatrixFile(cacheKey, relDirPath);

            if (cacheFile == null || !cacheFile.isFile()) {
                cacheFileWritingTaskExecutorService.execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            // check one more time if the cache wasn't created by other threads.
                            if (cacheFile == null || !cacheFile.isFile()) {
                                summaryMatrixFileWriterService.writeSummaryMatrix(cacheKey, relDirPath, matrix);
                            }
                        } catch (Exception e) {
                            logger.error("Failed to save summary matrix to the cache file.", e);
                        }
                    }
                });
            }
        } catch (Exception e) {
            logger.error("Failed to submit the task to cache summary matrix to the cache file.", e);
        }
    }

    private void checkServiceTimeout() throws ServiceTimeoutException {
        if (WDC.isStarted()) {
            final long curDuration = WDC.getCurrentDurationTimeMillis();

            if (curDuration > DEFAULT_SERVICE_TIME_OUT) {
                throw new ServiceTimeoutException("ReportController timed out: " + curDuration + "ms.");
            }
        }
    }

    public Map<String, Object> insertReport(ReportMstrDTO reportMstrDTO) throws SQLException{
        Map<String, Object> map = new HashMap<String,Object>();
        boolean result = false;

        // TODO: regUserNo -> 로그인 개발 시 추가 필요
        ReportMstrEntity reportMstrEntity = ReportMstrEntity.builder()
            .reportId(reportMstrDTO.getReportId())
            .reportNm(reportMstrDTO.getReportNm())
            .reportSubTitle(reportMstrDTO.getReportSubTitle())
            .fldId(reportMstrDTO.getFldId())
            .fldType(reportMstrDTO.getFldType())
            .reportOrdinal(reportMstrDTO.getReportOrdinal())
            .reportType(reportMstrDTO.getReportType().toString())
            .reportDesc(reportMstrDTO.getReportDesc())
            .reportTag(reportMstrDTO.getReportTag())
            .paramXml(reportMstrDTO.getParamXml())
            .regUserNo(reportMstrDTO.getRegUserNo())
            .chartXml(reportMstrDTO.getChartXml())
            .layoutXml(reportMstrDTO.getLayoutXml())
            .reportXml(reportMstrDTO.getReportXml())
            .datasetXml(reportMstrDTO.getDatasetXml())
            .build();

        String duplicationStatus = checkDuplicatedReport(reportMstrEntity);

        try {
            if ("N".equals(duplicationStatus)) {
                result = reportDAO.insertReport(reportMstrEntity);

                if (result) {
                    reportMstrDTO.setReportId(reportMstrEntity.getReportId());
                    map.put("msg", "saveReportMsg");
                } else {
                    map.put("msg", "faildSaveReportMsg");
                }
            } else {
                reportMstrDTO.setDupleYn(duplicationStatus);
                map.put("msg", "duplicatedSaveReportMsg");
            }

            map.put("report", reportMstrDTO);
            map.put("result", result);
        } catch (Exception e) {
            // 예외 발생 시 로깅 또는 다른 처리를 추가할 수 있습니다.
            e.printStackTrace(); // 또는 로깅 프레임워크를 사용하여 로그에 기록할 수 있음
            throw new RuntimeException("Add report failed: " + e.getMessage(), e);
        }
        return map;
    }

    public Map<String, Object> updateReport(ReportMstrDTO reportMstrDTO) {
        Map<String, Object> map = new HashMap<String,Object>();
        boolean result = false;

        // TODO: regUserNo -> 로그인 개발 시 추가 필요
        ReportMstrEntity reportMstrEntity = ReportMstrEntity.builder()
            .reportId(reportMstrDTO.getReportId())
            .reportNm(reportMstrDTO.getReportNm())
            .reportSubTitle(reportMstrDTO.getReportSubTitle())
            .fldId(reportMstrDTO.getFldId())
            .fldType(reportMstrDTO.getFldType())
            .reportOrdinal(reportMstrDTO.getReportOrdinal())
            .reportType(reportMstrDTO.getReportType().toString())
            .reportDesc(reportMstrDTO.getReportDesc())
            .reportTag(reportMstrDTO.getReportTag())
            .paramXml(reportMstrDTO.getParamXml())
            .regUserNo(0)
            .chartXml(reportMstrDTO.getChartXml())
            .layoutXml(reportMstrDTO.getLayoutXml())
            .reportXml(reportMstrDTO.getReportXml())
            .datasetXml(reportMstrDTO.getDatasetXml())
            .build();

        try {
            result = reportDAO.updateReport(reportMstrEntity);

            if (result) {
                reportMstrDTO.setReportId(reportMstrEntity.getReportId());
                map.put("msg", "saveReportMsg");
            } else {
                map.put("msg", "faildSaveReportMsg");
            }

            map.put("report", reportMstrDTO);
            map.put("result", result);
        } catch (Exception e) {
            // 예외 발생 시 로깅 또는 다른 처리를 추가할 수 있습니다.
            e.printStackTrace(); // 또는 로깅 프레임워크를 사용하여 로그에 기록할 수 있음
            throw new RuntimeException("Add report failed: " + e.getMessage(), e);
        }

        return map;
    }

    public boolean patchConfigReport(ReportMstrEntity reportMstrEntity) {
        return reportDAO.updateConfigReport(reportMstrEntity);
    }

    public Map<String, Object> deleteReport(ReportMstrDTO reportMstrDTO) {
        Map<String, Object> map = new HashMap<String,Object>();
        boolean result = false;
        int reportId = reportMstrDTO.getReportId();

        try {
            result = reportDAO.deleteReport(reportId);

            if (result) {
                map.put("report", reportMstrDTO);
                map.put("msg", "deleteReportMsg");
            } else {
                map.put("msg", "failedDeleteReportMsg");
            }
            map.put("result", result);
        } catch (Exception e) {
            e.printStackTrace(); // 또는 로깅 프레임워크를 사용하여 로그에 기록할 수 있음
            throw new RuntimeException("Delete report failed: " + e.getMessage(), e);
        }
        return map;
    }

    public Map<String, List<ReportListDTO>> getReportList(String userId, ReportType reportType, EditMode editMode) {
        List<ReportListDTO> pubList = reportDAO.selectPublicReportList(userId, reportType.toStrList(),
                editMode.toString());
        List<ReportListDTO> priList = reportDAO.selectPrivateReportList(userId, reportType.toStrList(),
                editMode.toString());
        Map<String, List<ReportListDTO>> result = new HashMap<>();
        result.put("publicReport", pubList);
        result.put("privateReport", priList);
        return result;
    }

    public String checkDuplicatedReport(ReportMstrEntity reportMstrEntity) {
        List<ReportMstrEntity> result = reportDAO.checkDuplicatedReport(reportMstrEntity);
        return result.size() > 0 ? "Y" : "N";
    }

    @Transactional
    public void insertLinkReport(List<ReportLinkMstrDTO> reportLinkDTO) {
        for (ReportLinkMstrDTO dto : reportLinkDTO) {
            ReportLinkMstrEntity entity = ReportLinkMstrDTO.toEntity(dto);
            reportDAO.insertLinkReport(entity);
        }
    }

    @Transactional
    public void insertSubLinkReport(List<ReportLinkSubMstrDTO> reportLinkSubDTO) {
        for (ReportLinkSubMstrDTO dto : reportLinkSubDTO) {
            ReportLinkSubMstrEntity entity = ReportLinkSubMstrDTO.toEntity(dto);
            reportDAO.insertSubLinkReport(entity);
        }
    }

    public Map<String, Object> getLinkReportParam(String reportId) {
    	ReportMstrEntity entity = reportDAO.selectLinkReportParam(reportId);
        Map<String, Object> returnMap = new HashMap<>();

        	JSONArray informations = new JSONArray(entity.getParamXml());
        	if(ReportType.EXCEL.toStrList().contains(entity.getReportType())) {
        		JSONObject spread = new JSONObject(entity.getReportXml());
        		returnMap.put("spread", spread.toString());
        	}
        	returnMap.put("informations", informations.toString());
        
        Map<String, Object> report = new HashMap<String, Object>();
    	List<Map<String, Object>> reports = new ArrayList<Map<String, Object>>();


    	report.put("reportId", Integer.parseInt(reportId));

    	reports.add(report);

    	returnMap.put("reports", reports);
        return returnMap;
    }

    public Map<String, Object> getAggregatedReportLinks(String reportId) {
        Map<String, Object> result = new HashMap<>();
        List<ReportLinkMstrEntity> linkReportList = reportDAO.selectLinkReportList(reportId);
        List<ReportLinkSubMstrEntity> subLinkReportList = reportDAO.selectSubLinkReportList(reportId);

        result.put("linkReports", linkReportList);
        result.put("subLinkReports", subLinkReportList);

        return result;
    }

    public Map<String, List<FolderMasterVO>> getReportFolderList(String userId) {
        Map<String, List<FolderMasterVO>> result = new HashMap<>();

        List<FolderMasterVO> publicFolderList = reportDAO.selectPublicReportFolderList(userId);
        List<FolderMasterVO> privateFolderList = reportDAO.selectPrivateReportFolderList(userId);
        result.put("publicFolder", publicFolderList);
        result.put("privateFolder", privateFolderList);

        return result;
    }

    public MartResultDTO getDetailedData(String userId, String dsId, String cubeId,
            String actId, List<Parameter> parameters) {

        List<Dimension> dimensions = new ArrayList<>();
        List<Measure> measures = new ArrayList<>();

        List<DetailedDataItemVO> items = reportDAO.selectDetailedDataItem(cubeId, actId);

        for (DetailedDataItemVO item : items) {
            if ("measure".equals(item.getType())) {
                measures.add(Measure.builder().uniqueName(item.getRtnItemUniNm()).build());
            } else {
                dimensions.add(Dimension.builder().uniqueName(item.getRtnItemUniNm()).build());
            }
        }

        DataAggregation dataAggregation = DataAggregation.builder()
                .dimensions(dimensions)
                .measures(measures)
                .parameters(parameters)
                .dataset(new Dataset(Integer.parseInt(dsId), Integer.parseInt(cubeId), 0, "", DsType.CUBE))
                .userId(userId)
                .sortByItems(new ArrayList<>())
                .itemType(ItemType.DATA_GRID)
                .build();

        QueryGeneratorFactory queryGeneratorFactory = new QueryGeneratorFactory();
        QueryGenerator queryGenerator = queryGeneratorFactory.getDataStore(DsType.CUBE);

        DsMstrDTO dsMstrDTO = datasetService.getDataSource(Integer.parseInt(dsId));

        martConfig.setMartDataSource(dsMstrDTO);

        String query = queryGenerator.getQuery(dataAggregation);

        MartResultDTO martResultDTO = martDAO.select(dsMstrDTO.getDsId(), query);

        return martResultDTO;
    }

}
