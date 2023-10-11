package com.wise.MarketingPlatForm.dataset.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.dataset.dao.DatasetDAO;
import com.wise.MarketingPlatForm.dataset.dao.MartDAO;
import com.wise.MarketingPlatForm.dataset.entity.DSMstrEntity;
import com.wise.MarketingPlatForm.dataset.type.DBMSType;
import com.wise.MarketingPlatForm.dataset.type.DSType;
import com.wise.MarketingPlatForm.dataset.vo.DBColumnVO;
import com.wise.MarketingPlatForm.dataset.vo.DBTableVO;
import com.wise.MarketingPlatForm.dataset.vo.DSMstrDTO;
import com.wise.MarketingPlatForm.dataset.vo.DatasetFieldVO;
import com.wise.MarketingPlatForm.global.config.mart.MartConfig;

@Service
public class DatasetService {

  @Autowired
  DatasetDAO datasetDAO;
  
  @Autowired
  MartDAO martDAO;

  @Autowired
  MartConfig martConfig;
  
  DatasetService(DatasetDAO datasetDAO) {
    this.datasetDAO = datasetDAO;
  }

  public List<DSMstrDTO> getDataSources(String userId) {
    List<DSMstrEntity> entities = datasetDAO.selectUserAuthDsList(userId);

    if (entities.isEmpty()) {
      entities = datasetDAO.selectGrpAuthDsList(userId);
    }

    List<DSMstrDTO> result = new ArrayList<>();

    for (DSMstrEntity entity : entities) {
      result.add(DSMstrDTO.builder()
      .dsId(entity.getDsId())
      .dsNm(entity.getDsNm())
      .ip(entity.getIp())
      .port(entity.getPort())
      .dbNm(entity.getDbNm())
      .ownerNm(entity.getOwnerNm())
      .userId(entity.getUserId())
      .userAreaYn(entity.getUserAreaYn())
      .dsDesc(entity.getDsDesc())
      .dbmsType(DBMSType.fromString(entity.getDbmsType()).get())
      .build());
    }

    return result;
  }

  public List<DBTableVO> getDBTables(String dsId, String search) {
    return null;
  }

  public List<DBColumnVO> getDBColumns(String dsId, String table, String search) {
    return null;
  }

  // TODO: 추후 필터 정보도 받아와야 함.
  public List<DatasetFieldVO> getDatasetFields(String dsId, DSType dsType, String query) {
    return null;
  }

  public List<HashMap<String, Object>> MartSelectList() {
	  
	DSMstrDTO dsMstrDTO = DSMstrDTO.builder()
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
		    .dbmsType(DBMSType.MS_SQL)
		    .build();
	  
	martConfig.setMartDataSource(dsMstrDTO);
	String query = "SELECT * FROM BMT_F_버블차트";
	return martDAO.selectList(query);
  }
}
