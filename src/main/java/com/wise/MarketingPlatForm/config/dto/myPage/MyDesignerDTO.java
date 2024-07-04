package com.wise.MarketingPlatForm.config.dto.myPage;

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
  Integer defaultDatasetId;
  Integer defaultReportId;
  Integer defaultViewerReportId;
  String defaultItem;
  String defaultLayout;
  String defaultPalette;
  String defaultDatasetNm;
  String defaultReportNm;
  String defaultReportType;
  String defaultViewerReportNm;
  String reportType;
}
