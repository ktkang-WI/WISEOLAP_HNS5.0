package com.wise.MarketingPlatForm.report.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.wise.MarketingPlatForm.data.QueryResultCacheManager;
import com.wise.MarketingPlatForm.dataset.domain.cube.vo.DetailedDataItemVO;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.global.config.MartConfig;
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
import com.wise.MarketingPlatForm.report.entity.ReportLinkMstrEntity;
import com.wise.MarketingPlatForm.report.entity.ReportLinkSubMstrEntity;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
import com.wise.MarketingPlatForm.report.type.ItemType;
import com.wise.MarketingPlatForm.report.type.EditMode;
import com.wise.MarketingPlatForm.report.type.ReportType;
import com.wise.MarketingPlatForm.report.vo.ReportListDTO;
import com.wise.MarketingPlatForm.report.vo.FolderMasterVO;
import com.wise.MarketingPlatForm.report.vo.ReportLinkMstrDTO;
import com.wise.MarketingPlatForm.report.vo.ReportLinkSubMstrDTO;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;
import org.json.JSONArray;
import org.json.JSONObject;

@Service
public class ReportService {

    private final ReportDAO reportDAO;
    private final MartConfig martConfig;
    private final MartDAO martDAO;
    private final DatasetService datasetService;

    @Autowired
    private XMLParserFactory xmlParserFactory;
    private QueryResultCacheManager queryResultCacheManager;

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
                /* TODO: 송봉조 주임 삭제 요청
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
    			} */
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
            .modUserNo(reportMstrDTO.getModUserNo())
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
