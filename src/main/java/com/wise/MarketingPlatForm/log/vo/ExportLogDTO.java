package com.wise.MarketingPlatForm.log.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExportLogDTO {
    String eventDt;
    String eventTime;
    String reportNm;
    String reportType;
    String userId;
    String userNm;
    String grpNm;
    String accessIp;
    String ctrlId;
    String ctrlCaption;
}
