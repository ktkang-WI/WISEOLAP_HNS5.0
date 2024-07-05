package com.wise.MarketingPlatForm.report.vo;

import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;

@Getter
@Setter
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
    Timestamp regDt;
    String requester;
    int regUserNo;
    String regUserName;
    Timestamp modDt;
    int modUserNo;
    String modUserName;
    String reportTag;
    String reportDesc;
    String dataset;
}