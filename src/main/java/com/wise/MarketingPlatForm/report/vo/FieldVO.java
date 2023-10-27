package com.wise.MarketingPlatForm.report.vo;


import com.wise.MarketingPlatForm.dataset.type.DataFieldType;
import lombok.Builder;
import lombok.Getter;

@Getter
public class FieldVO {
	// 공통 & 쿼리 직접입력
	private String icon;
    private String name;
    private DataFieldType type; // 확인 필요
    private String uniqueName;
    private String dataType;
    private String parnetId;
    // 주제영역
    private String logicalName;
    private int order;
    private String orderBy;
    private String orderByKey;
    private String orderByName;
    private String physicalName;

    // 주제영역 빌더
    @Builder(builderMethodName = "cubeFieldBuilder", builderClassName = "cubeFieldBuilder")
	public FieldVO(String icon, String name, DataFieldType type, String uniqueName, String dataType, String parnetId, 
			String logicalName, int order, String orderBy, String orderByKey, String orderByName, String physicalName) {
		this.icon = icon;
		this.name = name;
		this.type = type;
		this.uniqueName = uniqueName;
		this.dataType = dataType;
		this.parnetId = parnetId;
		this.logicalName = logicalName;
		this.order = order;
		this.orderBy = orderBy;
		this.orderByKey = orderByKey;
		this.orderByName = orderByName;
		this.physicalName = physicalName;
	}
    // 쿼리직접입력 빌더
	@Builder(builderClassName = "queryFieldBuilder",builderMethodName = "queryFieldBuilder")
	public static FieldVO asQuery(String icon, String name, DataFieldType type, String uniqueName, 
		 String dataType, String parnetId) {
	 	return FieldVO.cubeFieldBuilder().icon(icon).name(name).type(type)
		 		   .uniqueName(uniqueName).dataType(dataType).parnetId(parnetId).build();
	}

}
