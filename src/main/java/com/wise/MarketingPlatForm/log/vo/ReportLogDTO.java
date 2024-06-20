package com.wise.MarketingPlatForm.log.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReportLogDTO {
    String statusCd;
    int reportId;
    String logSeq;
    String reportNm;
    String reportType;
    String startDt;
    String endDt;
    String userId;
    String userNm;
    String grpNm;
    String accessIp;
}
