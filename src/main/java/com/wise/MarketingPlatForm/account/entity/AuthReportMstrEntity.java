package com.wise.MarketingPlatForm.account.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthReportMstrEntity {
  String authView;
  String authPublish;
  String authDataItem;
  String authExport;
}
