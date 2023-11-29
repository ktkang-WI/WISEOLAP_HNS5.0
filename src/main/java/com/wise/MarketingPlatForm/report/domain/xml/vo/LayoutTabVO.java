package com.wise.MarketingPlatForm.report.domain.xml.vo;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class LayoutTabVO extends ParentLayout{
	String component;
	String name;
}
