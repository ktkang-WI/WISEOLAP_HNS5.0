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
public class AdvancedDTO {
  private Integer searchTimeOut;
  private Integer searchLimitSize;
  private Integer concurrentTaskLimit;
  private Integer serverExcelDownloadProcessingCount;
  private Integer unusedExpirationDate;
  private Integer concurrentConnectionLimit;
  private Integer passwordChangePeriod;
  private Integer accountLockoutOnLoginFailure;
  private String mainLayout;
  private String reportAuth;
  private String nullValue;
  private boolean dashboardDataField;
  private boolean viewerUrlWithReport;
  private boolean viewerAutoDisplayConfig;
  private boolean designerShortcutEnabled;
  private boolean queryErrorLogVisible;
  private boolean queryCacheEnabled;
}
