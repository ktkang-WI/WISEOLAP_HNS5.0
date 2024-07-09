package com.wise.MarketingPlatForm.dataset.domain.cube.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CubeMeaColEntity {
  int cubeId;
  int dsViewId;
  String uniqueName;
  String tableName;
  String dataType;
  String captionName;
  String summaryType;
  String folder;
  String expression;
  String format;
  int meaOrder;
  String description;
  boolean visible;
}
