package com.wise.MarketingPlatForm.report.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportListDTO {
    int id;
    String name;
    int upperId;
    int ordinal;
    String reportType;
    String type;
}
