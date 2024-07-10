package com.wise.MarketingPlatForm.config.dto.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportDTO {
  private String adHocLayout;
  private boolean instantReportRetrieval;
  private String chartDefaultColor;
  private boolean print;
  private boolean sheet;
  private boolean table;
}
