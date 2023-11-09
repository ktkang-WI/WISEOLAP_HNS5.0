package com.wise.MarketingPlatForm.report.vo;

import lombok.Builder;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class RootFieldVO {
	String datasetId;
	@Builder.Default
	int dataFieldQuantity = 0;
}
