package com.wise.MarketingPlatForm.report.service;

import java.sql.Timestamp;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.google.gson.Gson;
import com.wise.MarketingPlatForm.config.controller.ConfigController;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.dataset.domain.cube.vo.CubeInfoDTO;
import com.wise.MarketingPlatForm.dataset.domain.cube.vo.DetailedDataItemVO;
import com.wise.MarketingPlatForm.dataset.service.CubeService;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.type.DataSetType;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.global.config.MartConfig;
import com.wise.MarketingPlatForm.global.util.SessionUtility;
import com.wise.MarketingPlatForm.global.util.Timer;
import com.wise.MarketingPlatForm.log.service.LogService;
import com.wise.MarketingPlatForm.log.vo.QueryLogDTO;
import com.wise.MarketingPlatForm.log.vo.ReportLogDTO;
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
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.store.QueryGenerator;
import com.wise.MarketingPlatForm.report.domain.store.factory.QueryGeneratorFactory;
import com.wise.MarketingPlatForm.report.domain.xml.ReportXMLParser;
import com.wise.MarketingPlatForm.report.domain.xml.factory.XMLParserFactory;
import com.wise.MarketingPlatForm.report.entity.DwReportChkEntity;
import com.wise.MarketingPlatForm.report.entity.ReportLinkMstrEntity;
import com.wise.MarketingPlatForm.report.entity.ReportLinkSubMstrEntity;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
import com.wise.MarketingPlatForm.report.type.ItemType;
import com.wise.MarketingPlatForm.report.type.EditMode;
import com.wise.MarketingPlatForm.report.type.ReportType;
import com.wise.MarketingPlatForm.report.vo.ReportListDTO;
import com.wise.MarketingPlatForm.report.vo.DwReportChkDTO;
import com.wise.MarketingPlatForm.report.vo.FolderMasterVO;
import com.wise.MarketingPlatForm.report.vo.ReportLinkMstrDTO;
import com.wise.MarketingPlatForm.report.vo.ReportLinkSubMstrDTO;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ReportService {
    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);

    private final ReportDAO reportDAO;
    private final MartConfig martConfig;
    private final MartDAO martDAO;
    private final DatasetService datasetService;
    private final CubeService cubeService;
    private final LogService logService;

    @Autowired
    private XMLParserFactory xmlParserFactory;

    ReportService(
        ReportDAO reportDAO, MartConfig martConfig, MartDAO martDAO,
        DatasetService datasetService, CubeService cubeService, LogService logService) {
        this.reportDAO = reportDAO;
        this.martConfig = martConfig;
        this.martDAO = martDAO;
        this.datasetService = datasetService;
        this.cubeService = cubeService;
        this.logService = logService;
    }
    
    private void reloadCubeFields(JSONObject datasets, String userId) 
    		throws JsonMappingException, JsonProcessingException, JSONException {
        if (datasets.get("datasets") == null) return;
        final ObjectMapper objectMapper = new ObjectMapper();
        final JSONArray datasetArray = datasets.getJSONArray("datasets");
        final Gson gson = new Gson();

        for (int i= 0; i < datasetArray.length(); i++) {
            JSONObject dataset = datasetArray.getJSONObject(i);
            if (dataset.has("cubeId")) {
                CubeInfoDTO cubeInfo = cubeService.getCube(dataset.get("cubeId").toString(), userId);
                final JsonNode reportFieldNodes = objectMapper.readTree(dataset.get("fields").toString());
                final JsonNode cubeFieldNodes = objectMapper.readTree(objectMapper.writeValueAsString(cubeInfo.getFields()));
                
                Set<String> uniqueEntries = new HashSet<>();
                ArrayNode uniqueArrayNode = objectMapper.createArrayNode();
                
                for (JsonNode node : cubeFieldNodes) {
                    String jsonString = node.get("uniqueName").asText();
                    if (uniqueEntries.add(jsonString)) {
                        uniqueArrayNode.add(node);
                    }
                };

                for (JsonNode node : reportFieldNodes) {
                    String jsonString = node.get("uniqueName").asText();
                    boolean isCustomData = node.has("isCustomData") ? node.get("isCustomData").asBoolean() : false;

                    if ((jsonString.equals("987654321") || isCustomData) && uniqueEntries.add(jsonString)) {
                        uniqueArrayNode.add(node);
                    }
                }

                dataset.put("fields", new JSONArray(objectMapper.writeValueAsString(uniqueArrayNode)));
                dataset.put("detailedData", new JSONArray(gson.toJson(cubeInfo.getDetailedData())));
            }
        }
    }
    

    public Map<String, Object> getReport(HttpServletRequest request, String reportId, String reportSeq) {
    	Map<String, Object> returnMap = new HashMap<>();
        Timer timer = new Timer();
        
        UserDTO user = SessionUtility.getSessionUser(request);
        String userId = user.getUserId();

        ReportLogDTO logDto = ReportLogDTO.builder()
                .logSeq(String.valueOf(new Timestamp(timer.getStartTime())))
                .reportId(Integer.parseInt(reportId))
                .userId(user.getUserId())
                .userNo(user.getUserNo())
                .userNm(user.getUserNm())
                .grpId(user.getGrpId())
                .accessIp(request.getRemoteAddr())
                .statusCd("50")
                .build();
    	try {
    		Gson gson = new Gson();
    		ObjectMapper objectMapper = new ObjectMapper();
    		objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
            
            timer.start();
            ReportMstrEntity entity;
            if (reportSeq == null || reportSeq.equals("")) {
                entity = reportDAO.selectReport(reportId);
            } else {
                entity = logService.selectReportHis(reportId, reportSeq);
            }
            
            
            logDto.setReportNm(entity.getReportNm());
            logDto.setReportType(entity.getReportType());

    		ReportMstrDTO dto = ReportMstrEntity.toDTO(entity);
    		if(!"newReport".equals(dto.getDatasetXml())) {
    			ReportXMLParser reportXmlParser = xmlParserFactory.getXmlParser(dto.getReportType());
    			returnMap = reportXmlParser.getReport(dto, userId);
    		} else {
    			JSONObject items = new JSONObject(objectMapper.readValue(entity.getChartXml(), Map.class));
    			JSONObject datasets = new JSONObject(objectMapper.readValue(entity.getDatasetXml(), Map.class));
                
    			reloadCubeFields(datasets, userId);
                
    			JSONObject layout = new JSONObject(entity.getLayoutXml());
    			JSONArray informations = new JSONArray(entity.getParamXml());
    			if(ReportType.EXCEL.toStrList().contains(entity.getReportType())) {
    				JSONObject spread = new JSONObject(entity.getReportXml());
    				returnMap.put("spread", spread.toString());
    			}
    			returnMap.put("item", items.toString());
    			returnMap.put("dataset", datasets.toString());
    			returnMap.put("layout", layout.toString());
    			returnMap.put("informations", informations.toString());
    		}
    		Map<String, Object> report = new HashMap<String, Object>();
    		List<Map<String, Object>> reports = new ArrayList<Map<String, Object>>();
    		
    		Map<String, Object> options = new HashMap<String, Object>();
    		options.put("order", entity.getReportOrdinal());
    		options.put("reportNm", entity.getReportNm());
    		options.put("fldId", entity.getFldId());
            options.put("requester", entity.getGridInfo());
    		options.put("fldType", entity.getFldType());
    		options.put("reportType", entity.getReportType());
    		options.put("reportTag", entity.getReportTag());
    		options.put("reportDesc", entity.getReportDesc());
    		options.put("reportSubTitle", entity.getReportSubTitle());
    		options.put("reportPath", null);
            options.put("promptYn", entity.getPromptYn() == null ? "N" : entity.getPromptYn());

            List<DwReportChkEntity>dwReportChkEntity = reportDAO.selectDwReportChk(reportId);
            DwReportChkDTO dwReportChkDTO = new DwReportChkDTO().fromEntityList(dwReportChkEntity);
            
            options.put("reportBos", dwReportChkDTO);
    		
    		report.put("reportId", Integer.parseInt(reportId));
    		report.put("options", options);
    		
    		reports.add(report);
    		
    		returnMap.put("reports", reports);
    	} catch (Exception e) {
            e.printStackTrace();
            logDto.setStatusCd("99");

    		returnMap.put("error", "error");
    	}
                    
        timer.end();

        logDto.setStartStamp(new Timestamp(timer.getStartTime()));
        logDto.setEndStamp(new Timestamp(timer.getEndTime()));

        logService.insertReportLog(logDto);

    	return returnMap;
    }

    public ReportResult getItemData(HttpServletRequest request, DataAggregation dataAggregation) {
        ReportResult result;

        QueryGeneratorFactory queryGeneratorFactory = new QueryGeneratorFactory();
        QueryGenerator queryGenerator = queryGeneratorFactory.getDataStore(dataAggregation.getDataset().getDsType());

        // TODO: 주제 영역일 경우 다르게 처리 현재는 쿼리 직접 입력만.
        // 추후 쿼리 queryGenerator에 구현
        DsMstrDTO dsMstrDTO = datasetService.getDataSource(dataAggregation.getDataset().getDsId());

        // TODO: 추후 DB 암호화 적용시 복호화 로직.
        // try {
        // Aes256Cipher aes256 = Aes256Cipher.getInstance();
        // String pw = aes256.AES_Decode(dsMstrDTO.getPassword());
        // dsMstrDTO.setPassword(pw);
        // } catch (Exception e) {
        // e.printStackTrace();
        // }
        martConfig.setMartDataSource(dsMstrDTO);

        String ownerNm = dsMstrDTO.getOwnerNm();

        String query = queryGenerator.getQuery(dataAggregation, ownerNm);

        Timer timer = new Timer();
        timer.start();
        MartResultDTO martResultDTO = martDAO.select(dsMstrDTO.getDsId(), query);
        
        timer.end();

        UserDTO user = dataAggregation.getUser();

        QueryLogDTO queryLogDTO = QueryLogDTO.builder()
                .eventStamp(new Timestamp(timer.getStartTime()))
                .reportId(Integer.parseInt(dataAggregation.getReportId()))
                .userId(user.getUserId())
                .reportType(dataAggregation.getReportType().toString())
                .userNo(user.getUserNo())
                .userNm(user.getUserNm())
                .grpId(user.getGrpId())
                .accessIp(request.getRemoteAddr())
                .runQuery(query)
                .dsId(dsMstrDTO.getDsId())
                .runTime(timer.getInterval())
                .build();

        logService.insertQueryLog(queryLogDTO);

        ItemDataMakerFactory itemDataMakerFactory = new ItemDataMakerFactory();
        ItemDataMaker itemDataMaker = itemDataMakerFactory.getItemDataMaker(dataAggregation.getItemType());
       
        result = itemDataMaker.make(dataAggregation, martResultDTO.getRowData());
        result.setQuery(query);

        return result;
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
            .gridInfo(reportMstrDTO.getGridInfo())
            .promptYn(reportMstrDTO.getPromptYn())
            .regUserNo(reportMstrDTO.getRegUserNo())
            .chartXml(reportMstrDTO.getChartXml())
            .layoutXml(reportMstrDTO.getLayoutXml())
            .reportXml(reportMstrDTO.getReportXml())
            .datasetXml(reportMstrDTO.getDatasetXml())
            .datasetQuery(reportMstrDTO.getDatasetQuery())
            .build();

        String duplicationStatus = checkDuplicatedReport(reportMstrEntity);

        try {
            if ("N".equals(duplicationStatus)) {
                result = reportDAO.insertReport(reportMstrEntity);

                if (result) {
                    reportMstrDTO.setReportId(reportMstrEntity.getReportId());
                    logService.insertReportHis(reportMstrDTO);
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
            .gridInfo(reportMstrDTO.getGridInfo())
            .paramXml(reportMstrDTO.getParamXml())
            .modUserNo(reportMstrDTO.getModUserNo())
            .chartXml(reportMstrDTO.getChartXml())
            .layoutXml(reportMstrDTO.getLayoutXml())
            .reportXml(reportMstrDTO.getReportXml())
            .datasetXml(reportMstrDTO.getDatasetXml())
            .datasetQuery(reportMstrDTO.getDatasetQuery())
            .build();

        try {
            result = reportDAO.updateReport(reportMstrEntity);

            if (result) {
                reportMstrDTO.setReportId(reportMstrEntity.getReportId());
                logService.insertReportHis(reportMstrDTO);
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

    public Map<String, Object> getReportListIncludeQuery() {
        List<ReportListDTO> pubList = reportDAO.publicReportList();
        Map<String, Object> result = new HashMap<>();

        try {
            List<Map<String, Object>> newPubList = getReportDataSource(pubList);

            result.put("publicReport", newPubList);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    public List<Map<String, Object>> getReportDataSource (List<ReportListDTO> reportList) {
        List<Map<String, Object>> datasourceList = new ArrayList<Map<String, Object>>();
        ObjectMapper objectMapper = new ObjectMapper();

        for (ReportListDTO report : reportList) {
            try {
                String dataset = report.getDataset();
                Map<String, Object> datasource = new HashMap<>();

                datasource.put("id", report.getId());
                datasource.put("upperId", report.getUpperId());
                datasource.put("name", report.getName());
                datasource.put("reportType", report.getReportType());
                if (report.getReportType() == null) {
                    datasource.put("reportType", report.getType());
                }

                if (dataset != null) {
                    Map<String, Object> datasetMap = objectMapper.readValue(dataset, Map.class);
                    List<Map<String, String>> datasetInfo = extractDatasetInfo(datasetMap);
                    StringBuilder queryBuilder = new StringBuilder();
                    for (Map<String, String> map : datasetInfo) {
                        queryBuilder.append(map.get("datasetQuery"));
                    }
                    
                    String query = queryBuilder.toString();

                    datasource.put("datasetInfo", datasetInfo);
                    datasource.put("query", query);
                }

                datasourceList.add(datasource);
            } catch (ClassCastException e) {
                logger.error("datsets,List<Map<String, Object>> 로 cast 실패", e);
            } catch (Exception e) {
                logger.error("datasetXml, datasets JSON parse 실패");
                throw new RuntimeException("failed to parse datasets JSON", e);
            }
        }

        return datasourceList;
    }

    private List<Map<String, String>> extractDatasetInfo(Map<String, Object> datasetMap) {
        List<Map<String, String>> datasetInfo = new ArrayList<>();
    
        try {
            if (datasetMap.containsKey("datasets")) {
                List<Map<String, Object>> datasetArray = (List<Map<String, Object>>) datasetMap.get("datasets");
                List<String> nameList = new ArrayList<String>();

                for (Map<String, Object> obj : datasetArray) {
                    Map<String, String> map = new HashMap<String, String>();
                    String datasetType = obj.getOrDefault("datasetType", "").toString();

                    // 쿼리 직접 입력, 단일테이블 데이터 집합 일 경우
                    map.put("datasetQuery", obj.getOrDefault("datasetQuery", "").toString());
                    map.put("datasetNm", obj.getOrDefault("datasetNm", "").toString());
                    map.put("datasetType", datasetType);

                    // 주제영역 데이터 집합 일 경우             
                    if (datasetType.equals(DataSetType.CUBE.toString())) {
                        List<Map<String, Object>> fieldsArray = (List<Map<String, Object>>) obj.get("fields");

                        for (Map<String, Object> field : fieldsArray) {
                            nameList.add(field.getOrDefault("name", "").toString());
                            nameList.add(field.getOrDefault("uniqueName", "").toString());
                        }
                        map.put("datasetQuery", nameList.toString());    
                    }
                    
                    datasetInfo.add(map);
                }
            }
        } catch (ClassCastException e) {
            throw new RuntimeException("invalid dataset format", e);
        }
    
        return datasetInfo;
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

    public Map<String, List<FolderMasterVO>> getReportFolderList(int userNo) {
        Map<String, List<FolderMasterVO>> result = new HashMap<>();

        List<FolderMasterVO> publicFolderList = reportDAO.selectPublicReportFolderList(userNo);
        List<FolderMasterVO> privateFolderList = reportDAO.selectPrivateReportFolderList(userNo);
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

    public String getOnlyReportName(String reportId) {
        return reportDAO.selectReportName(reportId);
    }

}
