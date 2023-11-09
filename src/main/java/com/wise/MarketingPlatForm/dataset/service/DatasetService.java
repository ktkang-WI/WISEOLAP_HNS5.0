package com.wise.MarketingPlatForm.dataset.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.dataset.dao.DatasetDAO;
import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;
import com.wise.MarketingPlatForm.dataset.entity.DsViewEntity;
import com.wise.MarketingPlatForm.dataset.type.DbmsType;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.dataset.vo.DbColumnVO;
import com.wise.MarketingPlatForm.dataset.vo.DbTableVO;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.dataset.vo.DsViewDTO;
import com.wise.MarketingPlatForm.global.config.MartConfig;
import com.wise.MarketingPlatForm.mart.dao.MartDAO;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.dataset.vo.DatasetFieldVO;

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

  public List<DbTableVO> getDBTables(String dsId, String search) {
    return null;
  }

  public List<DbColumnVO> getDBColumns(String dsId, String table, String search) {
    return null;
  }

  // TODO: 추후 필터 정보도 받아와야 함.
  public List<DatasetFieldVO> getDatasetFields(String dsId, DsType dsType, String query) {
    return null;
  }

  public List<DsViewDTO> getDsViews(String userId) {
    List<DsViewEntity> entities = datasetDAO.selectUserAuthDsViewList(userId);

    if (entities.isEmpty()) {
      entities = datasetDAO.selectGrpAuthDsViewList(userId);
    }

    List<DsViewDTO> result = new ArrayList<DsViewDTO> ();

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
	  MartResultDTO re = new MartResultDTO();
	  
	  try {
		re = martDAO.select(newQuery);
	} catch (Exception e) {
		log.warn(e.toString());
		
		List<Map<String, Object>> err = new ArrayList<Map<String,Object>>();
		err.add(Collections.singletonMap("error", e.toString()));
		
		re.setRowData(err);
	}
	  return re;
  }
  
  private String convertTopN(String sql, String dbType, int rowNum) {
  	if ("MS_SQL".equals(dbType)) {
  		sql = "SELECT TOP " + rowNum + " * FROM (\n" + sql + "\n) AS A";
  	} else {
  		sql = "SELECT * FROM (\n" + sql + "\n) WHERE ROWNUM <= " + rowNum;
  	}
  	return sql;
  }

}
