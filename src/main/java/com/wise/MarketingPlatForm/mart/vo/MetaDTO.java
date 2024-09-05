package com.wise.MarketingPlatForm.mart.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MetaDTO {
	String columnName;
	String columnLabel;
	String columnType;
	String columnTypeName;
	String uniqueName;

	public void setUniqueName(String tableName) {
		if (tableName == null || tableName.isEmpty()) {
			this.uniqueName = "[" + this.columnName + "]";
		} else {
				this.uniqueName = "[" + tableName + "]." + "[" + this.columnName + "]";
		}
	}
}
