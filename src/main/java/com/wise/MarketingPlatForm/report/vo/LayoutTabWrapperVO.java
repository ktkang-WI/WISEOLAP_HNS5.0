package com.wise.MarketingPlatForm.report.vo;

import java.util.ArrayList;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class LayoutTabWrapperVO extends ParentLayout{
	@Builder.Default
	List<ParentLayout> children = new ArrayList<ParentLayout>();
	Double weight;
}
