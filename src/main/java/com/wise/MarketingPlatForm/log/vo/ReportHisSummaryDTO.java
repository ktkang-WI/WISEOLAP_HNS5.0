package com.wise.MarketingPlatForm.log.vo;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ReportHisSummaryDTO {
    int reportSeq;
    String userNm;
    String reportNm;
    String modDt;
}
