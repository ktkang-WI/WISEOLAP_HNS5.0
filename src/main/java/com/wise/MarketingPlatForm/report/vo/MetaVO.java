package com.wise.MarketingPlatForm.report.vo;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MetaVO {
	List<DatasetVO> datasets;
	List<ReportVO> reports;
}
