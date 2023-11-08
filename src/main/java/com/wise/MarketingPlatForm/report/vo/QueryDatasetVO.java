package com.wise.MarketingPlatForm.report.vo;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class QueryDatasetVO extends RootDataSetVO {
	int datasrcId; 
	String datasetQuery;
}
