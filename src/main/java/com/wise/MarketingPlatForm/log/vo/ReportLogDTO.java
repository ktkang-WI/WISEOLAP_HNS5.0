package com.wise.MarketingPlatForm.log.vo;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportLogDTO {
    String statusCd;
    int reportId;
    String logSeq;
    String reportNm;
    String reportType;
    String startDt;
    String endDt;
    Timestamp startStamp;
    Timestamp endStamp;
    String userId;
    String userNm;
    int userNo;
    int grpId;
    String grpNm;
    String accessIp;
}
