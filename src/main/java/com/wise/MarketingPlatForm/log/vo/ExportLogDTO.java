package com.wise.MarketingPlatForm.log.vo;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExportLogDTO {
    String eventDt;
    String eventTime;
    Timestamp eventStamp;
    int reportId;
    String reportNm;
    String reportType;
    String userId;
    String userNm;
    int userNo;
    int grpId;
    String grpNm;
    String accessIp;
    String ctrlId;
    String ctrlCaption;
}
