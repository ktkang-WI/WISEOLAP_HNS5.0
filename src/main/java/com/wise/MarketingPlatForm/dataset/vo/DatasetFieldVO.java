package com.wise.MarketingPlatForm.dataset.vo;

import com.wise.MarketingPlatForm.dataset.type.DataFieldType;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DatasetFieldVO {
  // 공통 속성
  String parentId;
  String uniqueName;
  DataFieldType type;
  String dataType;
  String name;
  
  // 주제영역 한정 속성
  String logicalName;
  String physicalName;
  String orderBy;
  String orderByKey;
  String orderByName;
  int order;
}
