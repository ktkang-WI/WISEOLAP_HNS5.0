package com.wise.MarketingPlatForm.report.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReportTokenDTO {
    int reportId;
    String userId;
    String reportType;
}
