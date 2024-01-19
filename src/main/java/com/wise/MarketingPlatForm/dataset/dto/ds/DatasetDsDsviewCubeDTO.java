package com.wise.MarketingPlatForm.dataset.dto.ds;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class DatasetDsDsviewCubeDTO {
  int dsCubeId;
  int dsViewId;
  int dsId;
  int cubeId;
  String dimUniNm;
  String dsViewNm;
  String dsNm;
  String dbmsType;
  String ownerNm;
  String ip;
  String dbNm;
  String cubeNm;
  String dimCaption;
}
