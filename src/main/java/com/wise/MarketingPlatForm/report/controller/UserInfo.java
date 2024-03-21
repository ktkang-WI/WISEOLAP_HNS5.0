package com.wise.MarketingPlatForm.report.controller;

public class UserInfo {
  private String userId;
  private String reportId;
  private String reportType;

  public UserInfo(String userId, String reportId, String reportType) {
      this.userId = userId;
      this.reportId = reportId;
    this.reportType = reportType;
  }

  // Getters
  public String getUserId() {
      return userId;
  }

  public String getReportId() {
      return reportId;
  }

  public String getReportType() {
      return reportType;
  }

}