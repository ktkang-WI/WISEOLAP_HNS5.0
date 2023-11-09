package com.wise.MarketingPlatForm.report.vo;

import com.wise.MarketingPlatForm.report.type.ItemType;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ItemsVO {
	String id;
	ItemMetaVO meta;
	String type;
}
