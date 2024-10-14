package com.wise.MarketingPlatForm.dataset.service.ds;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.dataset.dao.DatasetDAO;
import com.wise.MarketingPlatForm.dataset.entity.DsViewMeaEntity;

@Service
public class DatasetDsMeaService {
  @Autowired
  DatasetDAO datasetDAO;

  public List<DsViewMeaEntity> getDatasetDsViewMea(int cubeId) {

    List<DsViewMeaEntity> cubeMstrEntity = datasetDAO.selectDatasetCubeMea(cubeId);

    if (cubeMstrEntity == null) return null;

    return cubeMstrEntity;

  };
}
