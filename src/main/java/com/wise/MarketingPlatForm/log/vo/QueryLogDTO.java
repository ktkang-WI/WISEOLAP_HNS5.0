package com.wise.MarketingPlatForm.log.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QueryLogDTO {
    String eventDt;
    String eventTime;
    String reportType;
    String userId;
    String userNm;
    String grpNm;
    String accessIp;
    String dsNm;
    String dbNm;
    String dbIp;
    String dbmsType;
    String runTime;
    String runQuery;
}
