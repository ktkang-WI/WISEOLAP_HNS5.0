package com.wise.MarketingPlatForm.report.vo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReportOptionsVO {
	int order;
	String reportDesc;
	String reportNm;
	@Builder.Default
	String reportPath = "";
}
