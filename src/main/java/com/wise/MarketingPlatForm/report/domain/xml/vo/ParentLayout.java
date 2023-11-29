package com.wise.MarketingPlatForm.report.domain.xml.vo;

import org.apache.commons.lang3.RandomStringUtils;

import lombok.Builder;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public abstract class ParentLayout {
	@Builder.Default
	String id = RandomStringUtils.random(15, true, true);
	String type;
}
