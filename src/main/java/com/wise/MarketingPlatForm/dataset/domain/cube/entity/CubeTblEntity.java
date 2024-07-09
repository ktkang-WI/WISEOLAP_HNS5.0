package com.wise.MarketingPlatForm.dataset.domain.cube.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CubeTblEntity {
  int cubeId;
  int dsViewId;
  String uniqueName;
  String physicalName;
  String logicalName;
  int order;
  boolean visible;
}
