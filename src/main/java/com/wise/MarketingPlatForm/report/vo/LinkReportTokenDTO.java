package com.wise.MarketingPlatForm.report.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LinkReportTokenDTO {
  String reportId;
  // int reportId;
  String reportType;
  String parentReportId;
  // int parentReportId;
  String parentReportType;
  String userId;
  String promptYn;
  String linkNewTab;
}
