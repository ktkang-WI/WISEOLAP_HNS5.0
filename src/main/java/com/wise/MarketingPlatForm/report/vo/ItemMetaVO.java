package com.wise.MarketingPlatForm.report.vo;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ItemMetaVO {
	String memo;
	String name;
	RootFieldVO dataField;
}
