package com.wise.MarketingPlatForm.dataset.domain.cube.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CubeDimColEntity {
  int cubeId;
  int dsViewId;
  String uniqueName;
  String dimDimUniNm;
  String hieHieUniNm;
  String tableName;
  String dataType;
  String orderBy;
  String captionName;
  boolean visible;
  int order;
  String description;
}
