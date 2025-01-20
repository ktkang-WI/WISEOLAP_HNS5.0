package com.wise.MarketingPlatForm.log.vo;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueryLogDTO {
    String eventDt;
    String eventTime;
    Timestamp eventStamp;
    int reportId;
    String reportType;
    String reportNm;
    int userNo;
    String userId;
    String userNm;
    int grpId;
    String grpNm;
    String accessIp;
    String dsNm;
    int dsId;
    String dbNm;
    String dbIp;
    String dbmsType;
    String runTime;
    String runQuery;
}
