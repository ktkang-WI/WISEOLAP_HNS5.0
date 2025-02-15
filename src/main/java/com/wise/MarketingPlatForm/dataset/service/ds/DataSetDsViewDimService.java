package com.wise.MarketingPlatForm.dataset.service.ds;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.dataset.dao.DatasetDAO;
import com.wise.MarketingPlatForm.dataset.entity.DsViewDimEntity;

@Service
public class DataSetDsViewDimService {
  @Autowired
  DatasetDAO datasetDAO;

  public List<DsViewDimEntity> getDatasetDsViewDim() {

    List<DsViewDimEntity> cubeMstrEntity = datasetDAO.selectDatasetDsViewDim();

    if (cubeMstrEntity == null) return null;

    return cubeMstrEntity;
  };
}
