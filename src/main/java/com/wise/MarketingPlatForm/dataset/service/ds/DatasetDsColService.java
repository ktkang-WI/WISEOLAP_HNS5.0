package com.wise.MarketingPlatForm.dataset.service.ds;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.dataset.dao.DatasetDAO;
import com.wise.MarketingPlatForm.dataset.entity.DsViewColEntity;

@Service
public class DatasetDsColService {
  @Autowired
  DatasetDAO datasetDAO;

  public List<DsViewColEntity> getDatasetDsViewCol(int dsViewId) {

    List<DsViewColEntity> cubeMstrEntity = datasetDAO.selectDatasetDsViewCol(dsViewId);

    if (cubeMstrEntity == null) return null;

    return cubeMstrEntity;

  };
}
