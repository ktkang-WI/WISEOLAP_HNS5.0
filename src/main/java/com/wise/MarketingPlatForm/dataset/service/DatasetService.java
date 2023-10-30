package com.wise.MarketingPlatForm.dataset.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import com.wise.MarketingPlatForm.auth.service.AuthService;
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

  private final DatasetDAO datasetDAO;
  private final AuthService authService;
  private final MartConfig martConfig;
  private final MartDAO martDAO;

  DatasetService(DatasetDAO datasetDAO, AuthService authService, MartConfig martConfig, MartDAO martDAO) {
    this.datasetDAO = datasetDAO;
    this.authService = authService;
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

  public MartResultDTO MartSelectList() {  
	  DsMstrDTO dsMstrDTO = DsMstrDTO.builder()
	  		.dsId(2223)
	  	  .dsNm("[MSSQL] WISE_JKㅁ")
	  	  .ip("3.39.141.250")
	  	  .port("1433")
	  	  .dbNm("WISE_JK")
	  	  .ownerNm("dbo")
	  	  .password("dnltpdemo1012!@#$")
	  	  .userId("wise")
	  	  .connector("jdbc:sqlserver://3.39.141.250:1433;DatabaseName=WISE_JK")
	  	  .dsDesc("dnltpdemo1012!@#$")
	  	  .dbmsType(DbmsType.MS_SQL)
	  	  .build();
	    
	  martConfig.setMartDataSource(dsMstrDTO);
	  String query = "SELECT * FROM BMT_F_버블차트";
	  return martDAO.select(query);
  }
  
  public Map<String, MartResultDTO> getQueryDatasetTable(Map<String, String> datasource) {
	  List<DsMstrEntity> dsInfoEntity = datasetDAO.selectDsInfo(datasource.get("dsId"));
	  List<DsMstrDTO> result = new ArrayList<>();
	  Map<String, MartResultDTO> tbl_Col = new HashMap<>();
	  for(DsMstrEntity dsInfo : dsInfoEntity) {
		  result.add(DsMstrDTO.builder()
			        .dsId(dsInfo.getDsId())
			        .dsNm(dsInfo.getDsNm())
			        .ip(dsInfo.getIp())
			        .port(dsInfo.getPort())
			        .password(dsInfo.getPassword())
			        .dbNm(dsInfo.getDbNm())
			        .ownerNm(dsInfo.getOwnerNm())
			        .userId(dsInfo.getUserId())
			        .userAreaYn(dsInfo.getUserAreaYn())
			        .dsDesc(dsInfo.getDsDesc())
			        .dbmsType(DbmsType.fromString(dsInfo.getDbmsType()).get())
			        .build());
	  }
	  
	  martConfig.setMartDataSource(result.get(0));
	  // 쿼리 xml에 정리 -> db별로
//	  String query = "SELECT A.OBJECT_NAME TBL_NM, B.COMMENTS TBL_CAPTION "
//	  		+ "FROM	ALL_OBJECTS A, ALL_TAB_COMMENTS B"
//	  		+ " WHERE A.OWNER = B.OWNER"
//	  		+ " AND A.OBJECT_TYPE IN ('TABLE','VIEW')"
//	  		+ " AND A.OBJECT_NAME = B.TABLE_NAME "
//	  		+ " AND A.OWNER = 'DW'"
//	  		+ " AND ( UPPER(A.OBJECT_NAME) LIKE '%%'"
//	  		+ " OR UPPER(B.COMMENTS) LIKE '%%' )"
//	  		+ " ORDER BY 1;";
	  MartResultDTO result1 = martDAO.selectTalbe();
	  MartResultDTO result2 = martDAO.selectColumn();
	  tbl_Col.put("tables", result1);
	  tbl_Col.put("columns", result2);
	  return tbl_Col;
  }
}
