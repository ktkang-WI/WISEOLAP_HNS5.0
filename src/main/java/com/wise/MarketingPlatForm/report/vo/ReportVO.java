package com.wise.MarketingPlatForm.report.vo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReportVO {
	int reportId;
	ReportOptionsVO options;
}
