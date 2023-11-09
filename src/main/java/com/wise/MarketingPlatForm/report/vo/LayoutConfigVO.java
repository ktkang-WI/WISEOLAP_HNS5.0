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
//	필요시 추가.
//	List<Object> borders;
	@Builder.Default
	Map<String, Boolean> global = new HashMap<String, Boolean>() {{
	    put("tabEnableClose", false);
	}};
	@Builder.Default
	List<ParentLayout> layout = new ArrayList<ParentLayout>();
}
