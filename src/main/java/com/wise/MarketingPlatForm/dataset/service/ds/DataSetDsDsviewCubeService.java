package com.wise.MarketingPlatForm.dataset.service.ds;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.dataset.dao.DatasetDAO;
import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeMstrEntity;
import com.wise.MarketingPlatForm.dataset.dto.ds.DatasetDsDsviewCubeDTO;
import com.wise.MarketingPlatForm.dataset.entity.CubeDimMstrEntity;
import com.wise.MarketingPlatForm.dataset.model.DatasetDsDsviewCubeModel;

@Service
public class DataSetDsDsviewCubeService {
  
  @Autowired
  DatasetDAO datasetDAO;

  public List<DatasetDsDsviewCubeModel> getDatasetDsDsviewCube() {

    List<DatasetDsDsviewCubeDTO> datasetDsDsviewCube = datasetDAO.selectDatasetDsviewCubeDs();

    if (datasetDsDsviewCube == null) return null;

    List<DatasetDsDsviewCubeModel> datasetDsDsviewCubeModel
      = generateDatasetDsDsviewCubeObject(datasetDsDsviewCube);

    return datasetDsDsviewCubeModel;
  }

  public List<DatasetDsDsviewCubeModel> generateDatasetDsDsviewCubeObject(List<DatasetDsDsviewCubeDTO> datasetDsDsviewCubeDTO) {

    List<DatasetDsDsviewCubeModel> result = new ArrayList<>();
    List<CubeMstrEntity> cubeMstrList = new ArrayList<>();
    List<CubeDimMstrEntity> cubeDimMstrList = new ArrayList<>();
    DatasetDsDsviewCubeDTO dsView = null;
    CubeMstrEntity cube = null;
    DatasetDsDsviewCubeModel datasetDsDSviewCubeModel = null;
    int prevDsViewId = 0;
    boolean isThereToSave = false;
    
    List<Integer> datasetDsViewKeys = new ArrayList<>();
    List<Integer> cubeMstrKeys = new ArrayList<>();

    for (DatasetDsDsviewCubeDTO datasetDsDsviewCubeData : datasetDsDsviewCubeDTO) {

      int dsViewId = datasetDsDsviewCubeData.getDsViewId();
      int cubeId = datasetDsDsviewCubeData.getCubeId();
      boolean lastDsViewIdNumber = ((prevDsViewId != dsViewId) && prevDsViewId != 0);
      boolean isDsViewContained = datasetDsViewKeys.contains(dsViewId);
      boolean isCubeIdContained = cubeMstrKeys.contains(cubeId);

      if (lastDsViewIdNumber) {
        datasetDsDSviewCubeModel = DatasetDsDsviewCubeModel.builder()
        .dsView(dsView)
        .cube(cubeMstrList)
        .cubeDim(cubeDimMstrList)
        .build();

        result.add(datasetDsDSviewCubeModel);
      
        cubeDimMstrList = new ArrayList<>();
        cubeMstrList = new ArrayList<>();
        cubeMstrKeys = new ArrayList<>();
      }

      if (!isDsViewContained) {
        dsView = DatasetDsDsviewCubeDTO.builder()
        .dsId(datasetDsDsviewCubeData.getDsId())
        .dsViewId(dsViewId)
        .dsViewNm(datasetDsDsviewCubeData.getDsViewNm())
        .dbmsType(datasetDsDsviewCubeData.getDbmsType())
        .ownerNm(datasetDsDsviewCubeData.getOwnerNm())
        .ip(datasetDsDsviewCubeData.getIp())
        .dbNm(datasetDsDsviewCubeData.getDbNm())
        .build();
        datasetDsViewKeys.add(dsViewId);
      }

      if (!isCubeIdContained) {
        cube = CubeMstrEntity.builder()
        .dsViewId(dsViewId)
        .cubeId(datasetDsDsviewCubeData.getCubeId())
        .cubeNm(datasetDsDsviewCubeData.getCubeNm())
        .build();
        cubeMstrList.add(cube);
        cubeMstrKeys.add(cubeId);
      }

      CubeDimMstrEntity cubeDim = CubeDimMstrEntity.builder()
        .dimDimUniNm(datasetDsDsviewCubeData.getDimUniNm())
        .cubeId(datasetDsDsviewCubeData.getCubeId())
        .dimCaption(datasetDsDsviewCubeData.getDimCaption())
        .build();
      cubeDimMstrList.add(cubeDim);

      prevDsViewId = dsViewId;

    }

    isThereToSave = cubeMstrList.size() > 0 || cubeDimMstrList.size() > 0;

    if (isThereToSave) {
      datasetDsDSviewCubeModel = DatasetDsDsviewCubeModel.builder()
        .dsView(dsView)
        .cube(cubeMstrList)
        .cubeDim(cubeDimMstrList)
        .build();

        result.add(datasetDsDSviewCubeModel);
    }

    return result;
  };
}
