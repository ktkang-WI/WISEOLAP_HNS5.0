package com.wise.MarketingPlatForm.report.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReportTokenDTO {
    int reportId;
    String userId;
    String reportType;
}
