package com.wise.MarketingPlatForm.log.vo;

import java.sql.Timestamp;

public class ReportHistoryDTO {
    int reportId;
    int reportSeq;
    String reportNm;
    int fldId;
    String fldType;
    int reportOrdinal;
    String reportType;
    String reportTag;
    String reportDesc;
    String gridInfo;
    String reportXml;
    String chartXml;
    String layoutXml;
    String datasetXml;
    String paramXml;
    String delYn;
    String promptYn;
    String reportSubTitle;
    int modUserNo;
    Timestamp eventStamp;
}
