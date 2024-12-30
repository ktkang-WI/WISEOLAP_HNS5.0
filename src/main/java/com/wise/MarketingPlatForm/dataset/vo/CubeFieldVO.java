package com.wise.MarketingPlatForm.dataset.vo;

import com.wise.MarketingPlatForm.dataset.type.DataFieldType;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class CubeFieldVO extends RootFieldVO{
  String logicalName;
  String physicalName;
  String orderBy;
  String orderByKey;
  String orderByName;
  int order;
  String description;
  String summaryType;
  String folder;
  DataFieldType parentType;
}
