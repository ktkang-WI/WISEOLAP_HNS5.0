package com.wise.MarketingPlatForm.report.vo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LayoutTabVO implements ParentLayout{
	String component;
	String id;
	String name;
	String type;
}
