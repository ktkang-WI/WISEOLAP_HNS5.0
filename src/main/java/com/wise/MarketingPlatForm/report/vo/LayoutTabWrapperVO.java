package com.wise.MarketingPlatForm.report.vo;

import java.util.ArrayList;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LayoutTabWrapperVO implements ParentLayout{
	@Builder.Default
	List<ParentLayout> children = new ArrayList<ParentLayout>();
	String type;
	Double weight;
}
