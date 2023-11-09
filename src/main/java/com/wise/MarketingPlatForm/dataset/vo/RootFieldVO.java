package com.wise.MarketingPlatForm.dataset.vo;

import com.wise.MarketingPlatForm.dataset.type.DataFieldType;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public abstract class RootFieldVO {
	String parentId;
	String uniqueName;
	String dataType;
	String name;
	String type;
}
