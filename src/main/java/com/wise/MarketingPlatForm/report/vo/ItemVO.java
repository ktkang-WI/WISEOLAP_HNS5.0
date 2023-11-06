package com.wise.MarketingPlatForm.report.vo;

import java.util.ArrayList;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ItemVO {
	int itemQuantity;
	String selectedItemId;
	@Builder.Default
	List<ItemsVO> items = new ArrayList<ItemsVO>();
}
