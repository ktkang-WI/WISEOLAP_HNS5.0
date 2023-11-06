package com.wise.MarketingPlatForm.report.vo;

import java.util.ArrayList;
import java.util.List;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class DataFieldVO {
	@Builder.Default
	List<Dimension> dimension = new ArrayList<Dimension>();
	@Builder.Default
	List<Measure> measure = new ArrayList<Measure>();
	String datasetId;
}
