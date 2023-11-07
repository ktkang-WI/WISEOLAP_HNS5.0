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
	// 추후에 dimensions로 변경해야됨 bjsong 2023-11-07
	@Builder.Default
	List<Dimension> dimension = new ArrayList<Dimension>();
	@Builder.Default
	List<Measure> measure = new ArrayList<Measure>();
	String datasetId;
}
