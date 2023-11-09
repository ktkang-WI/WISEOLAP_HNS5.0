package com.wise.MarketingPlatForm.report.vo;

import java.util.List;
import java.util.ArrayList;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DatasetWrapperVO {
	int selectedDatasetId;
	int datasetQuantity;
	@Builder.Default
	List<RootDataSetVO> datasets =  new ArrayList<RootDataSetVO>();
}
