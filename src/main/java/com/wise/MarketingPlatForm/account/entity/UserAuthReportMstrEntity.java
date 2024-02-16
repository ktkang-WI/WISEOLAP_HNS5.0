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
  String authView;
  String authPublish;
  String authDataItem;
  String authExport;
}
