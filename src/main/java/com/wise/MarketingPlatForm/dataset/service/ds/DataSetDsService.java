package com.wise.MarketingPlatForm.dataset.service.ds;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.dataset.dao.DatasetDAO;
import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;

@Service
public class DataSetDsService {

  @Autowired
  DatasetDAO datasetDAO;

  public List<DsMstrEntity> getDatasetDsData() {

    List<DsMstrEntity> dsMstrEntities = datasetDAO.selectDatasetDs();

    if (dsMstrEntities == null) return null;

    return dsMstrEntities;
  };

  public boolean updateDs(DsMstrEntity dsMstr) {
    return datasetDAO.updateDs(dsMstr);
  }

  public boolean deleteDs(DsMstrEntity dsMstr) {
    return datasetDAO.deleteDs(dsMstr);
  }

  public boolean createDs(DsMstrEntity dsMstr) {
    return datasetDAO.createDs(dsMstr);
  }
  
}
