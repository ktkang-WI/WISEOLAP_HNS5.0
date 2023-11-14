package com.wise.MarketingPlatForm.report.vo;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportMetaDTO {
	DatasetVO dataset;
	List<ReportVO> report = new ArrayList<ReportVO>();
	ItemVO item;
	LayoutDTO layout;
}
