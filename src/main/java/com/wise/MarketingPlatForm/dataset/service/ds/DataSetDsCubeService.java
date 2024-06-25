package com.wise.MarketingPlatForm.dataset.service.ds;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.dataset.dao.DatasetDAO;
import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeMstrEntity;

@Service
public class DataSetDsCubeService {
  @Autowired
  DatasetDAO datasetDAO;

  public List<CubeMstrEntity> getDatasetDsCube() {

    List<CubeMstrEntity> cubeMstrEntity = datasetDAO.selectDatasetDsCube();

    if (cubeMstrEntity == null) return null;

    return cubeMstrEntity;
  };
}
