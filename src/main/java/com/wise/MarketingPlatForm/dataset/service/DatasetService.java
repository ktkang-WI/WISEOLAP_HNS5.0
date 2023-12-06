package com.wise.MarketingPlatForm.dataset.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.sql.SQLException;
import java.sql.Types;
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
import com.wise.MarketingPlatForm.dataset.type.DataFieldType;
import com.wise.MarketingPlatForm.dataset.type.DbmsType;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.dataset.vo.DsViewDTO;
import com.wise.MarketingPlatForm.dataset.vo.QueryFieldVO;
import com.wise.MarketingPlatForm.dataset.vo.RootFieldVO;
import com.wise.MarketingPlatForm.global.config.MartConfig;
import com.wise.MarketingPlatForm.mart.dao.MartDAO;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.mart.vo.MetaDTO;
import com.wise.MarketingPlatForm.dataset.vo.CubeFieldVO;
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
                 if (StringUtils.containsAny(metaDTO.getColumnTypeName(), "int", "NUMBER")) {
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
        if ("MS_SQL".equals(dbType)) {
            sql = "SELECT TOP " + rowNum + " * FROM (\n" + sql + "\n) AS A";
        } else {
            sql = "SELECT * FROM (\n" + sql + "\n) WHERE ROWNUM <= " + rowNum;
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
            query = "SELECT " + listParameterDTO.getItemKey() + ", " + listParameterDTO.getItemCaption() +
                    (StringUtil.isBlank(listParameterDTO.getSortBy()) ? "" : ", " + listParameterDTO.getSortBy()) +
                    " FROM " + listParameterDTO.getDataSource();
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
}
