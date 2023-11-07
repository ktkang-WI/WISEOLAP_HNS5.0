package com.wise.MarketingPlatForm.report.vo;

import java.util.ArrayList;
import java.util.List;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import lombok.Builder;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class ChartFieldVO extends RootFieldVO{
	@Builder.Default
	List<Dimension> dimensions = new ArrayList<Dimension>();
	@Builder.Default
	List<Measure> measures = new ArrayList<Measure>();
	String datasetId;
}
