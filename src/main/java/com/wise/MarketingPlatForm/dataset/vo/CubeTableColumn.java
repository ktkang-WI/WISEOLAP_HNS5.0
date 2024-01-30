package com.wise.MarketingPlatForm.dataset.vo;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CubeTableColumn {
	int dsViewId;
	int cubeId;
	String physicalTableName;
	String physicalColumnName;
	String logicalTableName;
	String logicalColumnName;
	String levelLogicalColumnName;
	String levelColumnCaption;
	String level;

    String columnType;
    String columnCaption;
    String aggregationType;
    String displayType;
    String expression;
    String physicalColumnKey;
    String dataType;
    String dataLength;
    String primaryKeyYN;
    String visible;
    String orderBy;
    String orderByCaption;
    String uniqueName;
    int dateKey;
    int noLoading;
    List<CubeTableColumn> levelChildren;
}
