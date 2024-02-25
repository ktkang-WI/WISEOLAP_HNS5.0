package com.wise.MarketingPlatForm.dataset.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.util.StringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.wise.MarketingPlatForm.dataset.dao.DatasetDAO;
import com.wise.MarketingPlatForm.dataset.domain.parameter.vo.ListParameterDTO;
import com.wise.MarketingPlatForm.dataset.domain.parameter.vo.ListParameterResultVO;
import com.wise.MarketingPlatForm.dataset.domain.parameter.vo.util.ListParameterUtils;
import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;
import com.wise.MarketingPlatForm.dataset.entity.DsViewEntity;
import com.wise.MarketingPlatForm.dataset.entity.DsViewTableEntity;
import com.wise.MarketingPlatForm.dataset.type.DbmsType;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.dataset.vo.DsViewDTO;
import com.wise.MarketingPlatForm.dataset.vo.DsViewTableDTO;
import com.wise.MarketingPlatForm.global.config.MartConfig;
import com.wise.MarketingPlatForm.mart.dao.MartDAO;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.mart.vo.MetaDTO;
import com.wise.MarketingPlatForm.querygen.dto.Hierarchy;
import com.wise.MarketingPlatForm.querygen.dto.SelectCube;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeEtc;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeMeasure;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeOrder;
import com.wise.MarketingPlatForm.querygen.dto.SelectCubeWhere;
import com.wise.MarketingPlatForm.querygen.service.QuerySettingEx;
import com.wise.MarketingPlatForm.report.domain.data.data.Parameter;
import com.wise.MarketingPlatForm.report.domain.store.datastore.SqlQueryGenerator;

@Service
public class DatasetService {

    private static Logger log = LoggerFactory.getLogger(DatasetService.class);
    private final DatasetDAO datasetDAO;
    private final MartConfig martConfig;
    private final MartDAO martDAO;

    DatasetService(DatasetDAO datasetDAO, MartConfig martConfig, MartDAO martDAO) {
        this.datasetDAO = datasetDAO;
        this.martConfig = martConfig;
        this.martDAO = martDAO;
    }

    public List<DsMstrDTO> getDataSources(String userId) {
        List<DsMstrEntity> entities = datasetDAO.selectUserAuthDsList(userId);

        if (entities.isEmpty()) {
            entities = datasetDAO.selectGrpAuthDsList(userId);
        }

        List<DsMstrDTO> result = new ArrayList<>();

        for (DsMstrEntity entity : entities) {
            result.add(DsMstrDTO.builder()
                    .dsId(entity.getDsId())
                    .dsNm(entity.getDsNm())
                    .ip(entity.getIp())
                    .port(entity.getPort())
                    .dbNm(entity.getDbNm())
                    .ownerNm(entity.getOwnerNm())
                    .userId(entity.getUserId())
                    .userAreaYn(entity.getUserAreaYn())
                    .dsDesc(entity.getDsDesc())
                    .dbmsType(DbmsType.fromString(entity.getDbmsType()).get())
                    .build());
        }

        return result;
    }

    public DsMstrDTO getDataSource(int dsId) {
        DsMstrEntity entity = datasetDAO.selectDataSource(dsId);

        return DsMstrDTO.builder()
                .dsId(entity.getDsId())
                .dsNm(entity.getDsNm())
                .ip(entity.getIp())
                .port(entity.getPort())
                .dbNm(entity.getDbNm())
                .password(entity.getPassword())
                .ownerNm(entity.getOwnerNm())
                .userId(entity.getUserId())
                .userAreaYn(entity.getUserAreaYn())
                .dsDesc(entity.getDsDesc())
                .connector(entity.getConnector())
                .connectorType(entity.getConnectorType())
                .dbmsType(DbmsType.fromString(entity.getDbmsType()).get())
                .build();
    }

    public List<Map<String, Object>> getDBTables(String dsId) {
        DsMstrEntity dsMstrEntity = datasetDAO.selectDataSource(Integer.parseInt(dsId));

        DsMstrDTO dsMstrDTO = DsMstrDTO.builder()
                .dsId(dsMstrEntity.getDsId())
                .dsNm(dsMstrEntity.getDsNm())
                .ip(dsMstrEntity.getIp())
                .port(dsMstrEntity.getPort())
                .password(dsMstrEntity.getPassword())
                .dbNm(dsMstrEntity.getDbNm())
                .ownerNm(dsMstrEntity.getOwnerNm())
                .userId(dsMstrEntity.getUserId())
                .userAreaYn(dsMstrEntity.getUserAreaYn())
                .dsDesc(dsMstrEntity.getDsDesc())
                .dbmsType(DbmsType.fromString(dsMstrEntity.getDbmsType()).get())
                .build();

        martConfig.setMartDataSource(dsMstrDTO);

        Map<String, String> param = new HashMap<>();
        param.put("dbType", dsMstrDTO.getDbmsType().name());
        param.put("owner", dsMstrDTO.getOwnerNm());

        MartResultDTO tableList = martDAO.selectQueryDataTbl(param);
        List<Map<String, Object>> result = tableList.getRowData()
                .stream()
                .map(data -> {
                    if (data.get("TBL_CAPTION") == null) {
                        data.put("TBL_CAPTION", data.get("TBL_NM"));
                    }
                    return data;
                }).collect(Collectors.toList());
        return result;
    }

    public List<Map<String, Object>> getDBColumns(String dsId, String table) {
        DsMstrEntity dsMstrEntity = datasetDAO.selectDataSource(Integer.parseInt(dsId));

        DsMstrDTO dsMstrDTO = DsMstrDTO.builder()
                .dsId(dsMstrEntity.getDsId())
                .dsNm(dsMstrEntity.getDsNm())
                .ip(dsMstrEntity.getIp())
                .port(dsMstrEntity.getPort())
                .password(dsMstrEntity.getPassword())
                .dbNm(dsMstrEntity.getDbNm())
                .ownerNm(dsMstrEntity.getOwnerNm())
                .userId(dsMstrEntity.getUserId())
                .userAreaYn(dsMstrEntity.getUserAreaYn())
                .dsDesc(dsMstrEntity.getDsDesc())
                .dbmsType(DbmsType.fromString(dsMstrEntity.getDbmsType()).get())
                .build();

        martConfig.setMartDataSource(dsMstrDTO);

        Map<String, String> param = new HashMap<>();
        param.put("dbType", dsMstrDTO.getDbmsType().name());
        param.put("owner", dsMstrDTO.getOwnerNm());
        param.put("table", table);

        MartResultDTO columnList = martDAO.selectQueryDataCol(param);
        List<Map<String, Object>> result = columnList.getRowData()
                .stream()
                .map(data -> {
                    if (data.get("TBL_CAPTION") == null) {
                        data.put("TBL_CAPTION", data.get("TBL_NM"));
                    }
                    if (data.get("COL_CAPTION") == null) {
                        data.put("COL_CAPTION", data.get("COL_NM"));
                    }
                    return data;
                }).collect(Collectors.toList());
        return result;
    }

    public List<DsViewDTO> getDsViews(String userId) {
        List<DsViewEntity> entities = datasetDAO.selectUserAuthDsViewList(userId);

        if (entities.isEmpty()) {
            entities = datasetDAO.selectGrpAuthDsViewList(userId);
        }

        List<DsViewDTO> result = new ArrayList<DsViewDTO>();

        for (DsViewEntity entity : entities) {
            result.add(DsViewDTO.builder()
                    .dsId(entity.getDsId())
                    .ip(entity.getIp())
                    .dbNm(entity.getDbNm())
                    .dsViewDesc(entity.getDsViewDesc())
                    .dsViewId(entity.getDsViewId())
                    .dsViewNm(entity.getDsViewNm())
                    .dbmsType(DbmsType.fromString(entity.getDbmsType()).get())
                    .dsNm(entity.getDsNm())
                    .userAreaYn(entity.getUserAreaYn())
                    .port(entity.getPort())
                    .ownerNm(entity.getOwnerNm())
                    .userId(entity.getUserId())
                    .build());
        }

        return result;
    }

    public MartResultDTO martSelectList() {
        DsMstrDTO dsMstrDTO = DsMstrDTO.builder()
                .dsId(2564)
                .dsNm("[Oracle] WISEMART")
                .ip("52.79.199.37")
                .port("1539")
                .dbNm("wise")
                .ownerNm("WISEMART")
                .password("wisemart")
                .userId("wisemart")
                .connector("SID")
                .dsDesc("")
                .dbmsType(DbmsType.ORACLE)
                .build();

        martConfig.setMartDataSource(dsMstrDTO);
        String query = "SELECT * FROM BMT_F_버블차트";
        return martDAO.select(query);
    }

    public Map<String, MartResultDTO> getQueryDatasetTable(int dsId) {
        DsMstrEntity dsInfoEntity = datasetDAO.selectDataSource(dsId);
        Map<String, MartResultDTO> tbl_Col = new HashMap<>();
        Map<String, String> param = new HashMap<>();

        DsMstrDTO dsMstrDTO = DsMstrDTO.builder()
                .dsId(dsInfoEntity.getDsId())
                .dsNm(dsInfoEntity.getDsNm())
                .ip(dsInfoEntity.getIp())
                .port(dsInfoEntity.getPort())
                .password(dsInfoEntity.getPassword())
                .dbNm(dsInfoEntity.getDbNm())
                .ownerNm(dsInfoEntity.getOwnerNm())
                .userId(dsInfoEntity.getUserId())
                .userAreaYn(dsInfoEntity.getUserAreaYn())
                .dsDesc(dsInfoEntity.getDsDesc())
                .dbmsType(DbmsType.fromString(dsInfoEntity.getDbmsType()).get())
                .build();

        martConfig.setMartDataSource(dsMstrDTO);
        param.put("dbType", dsMstrDTO.getDbmsType().name());
        param.put("owner", dsMstrDTO.getOwnerNm());

        MartResultDTO tableList = martDAO.selectQueryDataTbl(param);
        MartResultDTO columnList = martDAO.selectQueryDataCol(param);

        tbl_Col.put("tables", tableList);
        tbl_Col.put("columns", columnList);

        return tbl_Col;
    }
    
    public MartResultDTO getQueryData(int dsId, String query, List<Parameter> parameters) {
        SqlQueryGenerator queryGenerator = new SqlQueryGenerator();
        query = queryGenerator.applyParameter(parameters, query);
        
        return this.getQueryData(dsId, query);
    }
    
    public MartResultDTO getQueryData(int dsId, String query) {
    	 DsMstrEntity dsInfoEntity = datasetDAO.selectDataSource(dsId);

         DsMstrDTO dsMstrDTO = DsMstrDTO.builder()
                 .dsId(dsInfoEntity.getDsId())
                 .dsNm(dsInfoEntity.getDsNm())
                 .ip(dsInfoEntity.getIp())
                 .port(dsInfoEntity.getPort())
                 .password(dsInfoEntity.getPassword())
                 .dbNm(dsInfoEntity.getDbNm())
                 .ownerNm(dsInfoEntity.getOwnerNm())
                 .userId(dsInfoEntity.getUserId())
                 .userAreaYn(dsInfoEntity.getUserAreaYn())
                 .dsDesc(dsInfoEntity.getDsDesc())
                 .dbmsType(DbmsType.fromString(dsInfoEntity.getDbmsType()).get())
                 .build();

         martConfig.setMartDataSource(dsMstrDTO);
         
         String newQuery = convertTopN(query, dsMstrDTO.getDbmsType().name(), 1);
         MartResultDTO resultDTO = new MartResultDTO();

         try {
             resultDTO = martDAO.select(newQuery);
             List<MetaDTO> metaDTOs = resultDTO.getMetaData();

             for (MetaDTO metaDTO : metaDTOs) {
                 if (StringUtils.containsAny(metaDTO.getColumnTypeName(), "int", "NUMBER", "numeric")) {
                     metaDTO.setColumnTypeName("decimal");
                 }
             }

         } catch (Exception e) {
             log.warn(e.toString());

             List<Map<String, Object>> err = new ArrayList<Map<String, Object>>();
             err.add(Collections.singletonMap("error", e.toString()));

             resultDTO.setRowData(err);
         }
         return resultDTO;
    }
    
    public MartResultDTO getQueryDatas(int dsId, String query, List<Parameter> parameters) {
        SqlQueryGenerator queryGenerator = new SqlQueryGenerator();
        query = queryGenerator.applyParameter(parameters, query);
        DsMstrEntity dsInfoEntity = datasetDAO.selectDataSource(dsId);

        DsMstrDTO dsMstrDTO = DsMstrDTO.builder()
                .dsId(dsInfoEntity.getDsId())
                .dsNm(dsInfoEntity.getDsNm())
                .ip(dsInfoEntity.getIp())
                .port(dsInfoEntity.getPort())
                .password(dsInfoEntity.getPassword())
                .dbNm(dsInfoEntity.getDbNm())
                .ownerNm(dsInfoEntity.getOwnerNm())
                .userId(dsInfoEntity.getUserId())
                .userAreaYn(dsInfoEntity.getUserAreaYn())
                .dsDesc(dsInfoEntity.getDsDesc())
                .dbmsType(DbmsType.fromString(dsInfoEntity.getDbmsType()).get())
                .build();

        martConfig.setMartDataSource(dsMstrDTO);
        
        MartResultDTO resultDTO = new MartResultDTO();

        try {
            resultDTO = martDAO.select(query);
            List<MetaDTO> metaDTOs = resultDTO.getMetaData();

            for (MetaDTO metaDTO : metaDTOs) {
                if (StringUtils.containsAny(metaDTO.getColumnTypeName(), "int", "NUMBER", "numeric")) {
                    metaDTO.setColumnTypeName("decimal");
                }
            }

        } catch (Exception e) {
            log.warn(e.toString());

            List<Map<String, Object>> err = new ArrayList<Map<String, Object>>();
            err.add(Collections.singletonMap("error", e.toString()));

            resultDTO.setRowData(err);
        }
        return resultDTO;
    }

    private String convertTopN(String sql, String dbType, int rowNum) {
    	if (rowNum != 0) {
    		if ("MS_SQL".equals(dbType)) {
    			sql = "SELECT TOP " + rowNum + " * FROM (\n" + sql + "\n) AS A";
    		} else {
    			sql = "SELECT * FROM (\n" + sql + "\n) WHERE ROWNUM <= " + rowNum;
    		}    		
    	}
        return sql;
    }

    public ListParameterResultVO getListParameterItems(ListParameterDTO listParameterDTO) {
        DsMstrEntity dsInfoEntity = datasetDAO.selectDataSource(listParameterDTO.getDsId());

        DsMstrDTO dsMstrDTO = DsMstrDTO.builder()
                .dsId(dsInfoEntity.getDsId())
                .dsNm(dsInfoEntity.getDsNm())
                .ip(dsInfoEntity.getIp())
                .port(dsInfoEntity.getPort())
                .password(dsInfoEntity.getPassword())
                .dbNm(dsInfoEntity.getDbNm())
                .ownerNm(dsInfoEntity.getOwnerNm())
                .userId(dsInfoEntity.getUserId())
                .userAreaYn(dsInfoEntity.getUserAreaYn())
                .dsDesc(dsInfoEntity.getDsDesc())
                .dbmsType(DbmsType.fromString(dsInfoEntity.getDbmsType()).get())
                .build();

        martConfig.setMartDataSource(dsMstrDTO);

        String query = "";

        // 리스트 조회
        if ("TABLE".equals(listParameterDTO.getDataSourceType())) {
            String column = listParameterDTO.getItemKey() + ", " + listParameterDTO.getItemCaption() +
                    (!StringUtil.isBlank(listParameterDTO.getSortBy()) ? ", " + listParameterDTO.getSortBy() : "");
            query = "SELECT " + column +
                    " FROM " + listParameterDTO.getDataSource() + " GROUP BY " + column;
        } else {
            query = listParameterDTO.getDataSource();
            query = ListParameterUtils.applyLinkageFilterAtQuery(query, listParameterDTO);
        }

        MartResultDTO result = martDAO.select(query);
        List<Map<String, Object>> listItems = ListParameterUtils.sanitize(result.getRowData(), listParameterDTO);

        List<String> defaultValue = listParameterDTO.getDefaultValue();

        if (listParameterDTO.isDefaultValueUseSql()) {
            defaultValue = getDefaultValues(listParameterDTO.getDsId(), listParameterDTO.getDefaultValue());
        }

        return new ListParameterResultVO(defaultValue, listItems);
    }

    public List<String> getDefaultValues(int dsId, List<String> queries) {
        List<String> defaultValues = new ArrayList<String>();

        DsMstrEntity dsInfoEntity = datasetDAO.selectDataSource(dsId);

        DsMstrDTO dsMstrDTO = DsMstrDTO.builder()
                .dsId(dsInfoEntity.getDsId())
                .dsNm(dsInfoEntity.getDsNm())
                .ip(dsInfoEntity.getIp())
                .port(dsInfoEntity.getPort())
                .password(dsInfoEntity.getPassword())
                .dbNm(dsInfoEntity.getDbNm())
                .ownerNm(dsInfoEntity.getOwnerNm())
                .userId(dsInfoEntity.getUserId())
                .userAreaYn(dsInfoEntity.getUserAreaYn())
                .dsDesc(dsInfoEntity.getDsDesc())
                .dbmsType(DbmsType.fromString(dsInfoEntity.getDbmsType()).get())
                .build();

        martConfig.setMartDataSource(dsMstrDTO);

        for (String query : queries) {
            if (StringUtil.isBlank(query)) {
                defaultValues.add("");
                continue;
            }
            MartResultDTO result = martDAO.select(query);
            List<Map<String, Object>> data = result.getRowData();

            if (data.size() == 0) {
                defaultValues.add("");
            } else {
                StringBuilder sb = new StringBuilder("");
                String key = "";
                for (String k : data.get(0).keySet()) {
                    key = k;
                    break;
                }

                for (Map<String, Object> map : data) {
                    sb.append(map.get(key));
                    sb.append(", ");
                }

                String value = sb.toString();
                value = value.substring(0, value.length() - 2);
                defaultValues.add(value);
            }
        }

        return defaultValues;
    }

    public String generateSingleTableQuery(int dsId, List<Map<String, Object>> columnList, List<Parameter> parameters) {

        String tableName = "";
        QuerySettingEx sqlQenQuery = new QuerySettingEx();
        ArrayList<SelectCube> aDtSel = new ArrayList<SelectCube>();
        ArrayList<Hierarchy> aDtSelHIe = new ArrayList<Hierarchy>();
        ArrayList<SelectCubeMeasure> aDtSelMea = new ArrayList<SelectCubeMeasure>();

        DsMstrEntity dsInfoEntity = datasetDAO.selectDataSource(dsId);

        DsMstrDTO dsMstrDTO = DsMstrDTO.builder()
                .dsId(dsInfoEntity.getDsId())
                .dsNm(dsInfoEntity.getDsNm())
                .ip(dsInfoEntity.getIp())
                .port(dsInfoEntity.getPort())
                .password(dsInfoEntity.getPassword())
                .dbNm(dsInfoEntity.getDbNm())
                .ownerNm(dsInfoEntity.getOwnerNm())
                .userId(dsInfoEntity.getUserId())
                .userAreaYn(dsInfoEntity.getUserAreaYn())
                .dsDesc(dsInfoEntity.getDsDesc())
                .dbmsType(DbmsType.fromString(dsInfoEntity.getDbmsType()).get())
                .build();

        String dsOwnerNm = dsMstrDTO.getOwnerNm();
        int columnListLength = columnList.size();
        for (int i = 0; i < columnListLength; i++) {
            Map<String, Object> column = columnList.get(i);

            SelectCube selCubemea = new SelectCube();

            if (column != null) {
                selCubemea.setUNI_NM(column.get("TBL_NM") + "." + column.get("COL_NM")); // TBL_NM+COL_NM
                selCubemea.setCAPTION(column.get("COL_CAPTION") + ""); // COL_CAPTION
                selCubemea.setDATA_TYPE(column.get("DATA_TYPE") + "");// DATA_TYPE
                selCubemea.setORDER(Integer.toString(i));// for문으로 추가
                selCubemea.setTYPE("MEA");// TYPE
                aDtSel.add(selCubemea);

                SelectCubeMeasure selMea = new SelectCubeMeasure();

                selMea.setMEA_GRP_UNI_NM(column.get("TBL_NM") + ""); // TBL_NM
                selMea.setMEA_UNI_NM(
                    column.get("TBL_NM") + "." + column.get("COL_NM")); // TBL_NM+COL_NM
                selMea.setMEA_CAPTION(column.get("COL_CAPTION") + ""); // COL_CAPTION
                selMea.setMEA_TBL_NM(column.get("TBL_NM")+""); // TBL_NM
                selMea.setMEA_COL_NM(column.get("COL_NM") + "");// COL_NM
                if (column.get("AGG") != null){
                    selMea.setMEA_AGG(column.get("AGG")+""); // AGG
                } else {
                    selMea.setMEA_AGG(""); // AGG
                }
                selMea.setCOL_EXPRESS("");
                aDtSelMea.add(selMea);

                tableName = column.get("TBL_NM") + "";
            }
            if ("".equals(tableName)) {
                tableName = column.get("TBL_NM") + "";
            }
        }

        String sql = sqlQenQuery.CubeQuerySettingSingleDS(aDtSel, aDtSelHIe, aDtSelMea,
                            new ArrayList<SelectCubeWhere>(), new ArrayList<SelectCubeOrder>(), "DB2",
                            new ArrayList<com.wise.MarketingPlatForm.querygen.dto.Relation>(), new ArrayList<com.wise.MarketingPlatForm.querygen.dto.Relation>(),
                             new ArrayList<SelectCubeEtc>());
        return sql;
    }

    public List<DsViewTableDTO> getDsViewDBTables(String dsId, String dsViewId) {
    
        List<DsViewTableEntity> dsViewTableEntityList = datasetDAO.selectDsViewTables(dsViewId);
        List<DsViewTableDTO> dsViewTableDtoList = new ArrayList<DsViewTableDTO>();
        
        for (DsViewTableEntity dsViewTableEntity : dsViewTableEntityList) {
            DsViewTableDTO dsViewTableDTO = DsViewTableDTO.builder()
                .tableNm(dsViewTableEntity.getTableNm())
                .tableCaption(dsViewTableEntity.getTableCaption())
                .build();

            dsViewTableDtoList.add(dsViewTableDTO);
        }

        return dsViewTableDtoList;
    }
}
