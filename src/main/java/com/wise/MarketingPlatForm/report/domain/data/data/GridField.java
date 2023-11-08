package com.wise.MarketingPlatForm.report.domain.data.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
// 이거는 없어도 될듯!!!!!! bjsong
public class GridField {
	String caption;
    String name;
    String uniqueName;
    String fieldId;
    String category;
    String type;
}
