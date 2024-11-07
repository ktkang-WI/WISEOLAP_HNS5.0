package com.wise.MarketingPlatForm.config.dto.myPage;

import com.wise.MarketingPlatForm.auth.type.RunMode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MyDesignerDTO {
  int userNo;
  @Builder.Default
  Integer defaultDatasetId = 0;
  @Builder.Default
  Integer defaultReportId = 0;
  @Builder.Default
  Integer adHocDefaultReportId = 0;
  @Builder.Default
  Integer excelDefaultReportId = 0;
  @Builder.Default
  Integer defaultViewerReportId = 0;
  // TODO: default 값 잠시 보류
  String defaultItem;
  String defaultLayout;
  @Builder.Default
  String defaultPalette = "";
  @Builder.Default
  String defaultDatasetNm = "";
  @Builder.Default
  String defaultReportNm = "";
  @Builder.Default
  String adHocDefaultReportNm = "";
  @Builder.Default
  String excelDefaultReportNm = "";
  @Builder.Default
  String defaultReportType = "";
  @Builder.Default
  String adHocDefaultReportType = "";
  @Builder.Default
  String excelDefaultReportType = "";
  @Builder.Default
  String defaultViewerReportNm = "";
  @Builder.Default
  String reportType = "";
  @Builder.Default
  String userNm = "";
  @Builder.Default
  String userId = "";
  @Builder.Default
  String maxReportQueryPeriod = "{\"check\": false, \"period\": 5}";
  RunMode runMode;
  @Builder.Default
  String grpRunMode = "";
}
