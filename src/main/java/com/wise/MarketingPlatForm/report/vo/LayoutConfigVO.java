package com.wise.MarketingPlatForm.report.vo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LayoutConfigVO {
	@Builder.Default
	List<Object> borders = new ArrayList<Object>();
	@Builder.Default
	Map<String, Boolean> global = new HashMap<String, Boolean>() {{
	    put("tabEnableClose", false);
	}};
	ParentLayout layout;
}
