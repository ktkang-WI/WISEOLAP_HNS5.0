package com.wise.MarketingPlatForm.report.entity;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DwReportChkEntity {
    private Date stdDate;
    private String chkGb;
    private String reportId;
    private String chkProg;
    private String sourceDb;
    private String compareDb;
    private String userNm;
    private Date insertDate;
}
