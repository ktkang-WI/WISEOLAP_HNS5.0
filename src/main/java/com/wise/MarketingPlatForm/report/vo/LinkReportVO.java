package com.wise.MarketingPlatForm.report.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@NoArgsConstructor
public class LinkReportVO {
	int reportId;
	int linkReportId;
	String linkReportNm;
	String linkType;
	String linkXml;
	String reportType;
}
