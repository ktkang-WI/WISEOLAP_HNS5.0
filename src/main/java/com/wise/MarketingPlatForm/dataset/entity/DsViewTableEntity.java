package com.wise.MarketingPlatForm.dataset.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DsViewTableEntity {
  int dsViewId;
  String tableNm;
  String tableCaption;
  String tableDesc;
  String tableType;
  String tableGrpNm;
  String queryDefinition;
}
