package com.wise.MarketingPlatForm.report.vo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MetaVO {
	@Builder.Default
	Map<Integer, List<DatasetVO>> datasets = new HashMap<Integer, List<DatasetVO>>();
	@Builder.Default
	Map<Integer, List<ReportVO>> reports = new HashMap<Integer, List<ReportVO>>();
	@Builder.Default
	Map<Integer, ItemVO> item =  new HashMap<Integer, ItemVO>();
	@Builder.Default
	Map<Integer, LayoutConfigVO> layout = new HashMap<Integer, LayoutConfigVO>();
}
