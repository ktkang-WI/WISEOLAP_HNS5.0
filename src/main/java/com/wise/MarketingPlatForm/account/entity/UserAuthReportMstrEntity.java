package com.wise.MarketingPlatForm.account.entity;

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
public class UserAuthReportMstrEntity {
  int userNo;
  int fldId;
  boolean authView;
  boolean authPublish;
  boolean authDatasource;
  boolean authDataItem;
  boolean authExport;
}
