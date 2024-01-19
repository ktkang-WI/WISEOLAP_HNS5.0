package com.wise.MarketingPlatForm.dataset.service.ds;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.dataset.dao.DatasetDAO;
import com.wise.MarketingPlatForm.dataset.dto.ds.DatasetDsDTO;
import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;

@Service
public class DatasetDsService {

  @Autowired
  DatasetDAO datasetDAO;

  public List<DsMstrEntity> getDatasetDsData() {
    
    List<DatasetDsDTO> datasetDsDTO = datasetDAO.selectDatasetDs();

    List<DsMstrEntity> datasetDsModel = generateDatasetDsObject(datasetDsDTO);

    return datasetDsModel;
  };

  public List<DsMstrEntity> generateDatasetDsObject(List<DatasetDsDTO> datasetDsDTO){

    List<DsMstrEntity> result = new ArrayList<>();
    DsMstrEntity dsMstrEntity = null;

    for (DatasetDsDTO datasetDs : datasetDsDTO) {
      dsMstrEntity = DsMstrEntity.builder()
        .dsId(datasetDs.getDsId())
        .dsNm(datasetDs.getDsNm())
        .dbmsType(datasetDs.getDbmsType())
        .ownerNm(datasetDs.getOwnerNm())
        .ip(datasetDs.getIp())
        .build();

      result.add(dsMstrEntity);
    }

    return result;
    
  };
}
