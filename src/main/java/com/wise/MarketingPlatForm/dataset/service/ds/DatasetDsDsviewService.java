package com.wise.MarketingPlatForm.dataset.service.ds;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.dataset.dao.DatasetDAO;
import com.wise.MarketingPlatForm.dataset.dto.ds.DatasetDsDTO;

@Service
public class DatasetDsDsviewService {
  @Autowired
  DatasetDAO datasetDAO;

  public List<DatasetDsDTO> getDatasetDsDsviewData() {

    List<DatasetDsDTO> datasetDsDTO = datasetDAO.selectDatasetDsDsview();

    if (datasetDsDTO == null) return null;

    return datasetDsDTO;
  };
}
