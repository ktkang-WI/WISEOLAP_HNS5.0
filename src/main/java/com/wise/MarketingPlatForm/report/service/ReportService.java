package com.wise.MarketingPlatForm.report.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.wise.MarketingPlatForm.data.QueryResultCacheManager;
import com.wise.MarketingPlatForm.data.file.CacheFileWritingTaskExecutorService;
import com.wise.MarketingPlatForm.data.file.SummaryMatrixFileWriterService;
import com.wise.MarketingPlatForm.data.list.CloseableList;
import com.wise.MarketingPlatForm.data.map.MapListDataFrame;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.global.config.MartConfig;
import com.wise.MarketingPlatForm.global.diagnos.WDC;
import com.wise.MarketingPlatForm.global.exception.ServiceTimeoutException;
import com.wise.MarketingPlatForm.mart.dao.MartDAO;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.report.controller.ReportController;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
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

@Service
public class ReportService {
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

    ReportService(MartConfig martConfig, MartDAO martDAO, DatasetService datasetService,
            QueryResultCacheManager queryResultCacheManager) {
        this.martConfig = martConfig;
        this.martDAO = martDAO;
        this.datasetService = datasetService;
        this.queryResultCacheManager = queryResultCacheManager;
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

        MartResultDTO martResultDTO = martDAO.select(query);
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
}
