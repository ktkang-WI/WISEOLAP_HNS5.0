package com.wise.MarketingPlatForm.dataset.service;

import java.util.ArrayList;
import java.util.List;

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
import com.wise.MarketingPlatForm.report.vo.DatasetVO;
import com.wise.MarketingPlatForm.dataset.vo.DatasetFieldVO;

@Service
public class DatasetService {

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

}
