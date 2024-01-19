package com.wise.MarketingPlatForm.dataset.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class DatasetDsDsviewCubeModel {
  int dsCubeId;
  int dsViewId;
  int dsId;
  int cubeId;
  String dsNm;
  String dbmsType;
  String ownerNm;
  String ip;
  String dbNm;

  String cubeNm;
  String dimCaption;
  
}
