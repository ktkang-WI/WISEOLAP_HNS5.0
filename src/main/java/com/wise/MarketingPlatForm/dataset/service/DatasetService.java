package com.wise.MarketingPlatForm.dataset.service;

import java.util.ArrayList;
import java.util.List;

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
import com.wise.MarketingPlatForm.dataset.vo.DatasetFieldVO;

@Service
public class DatasetService {

  private final DatasetDAO datasetDAO;
  private final AuthService authService;

  DatasetService(DatasetDAO datasetDAO, AuthService authService) {
    this.datasetDAO = datasetDAO;
    this.authService = authService;
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
}
