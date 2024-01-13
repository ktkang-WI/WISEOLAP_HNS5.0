package com.wise.MarketingPlatForm.mart.vo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MartResultDTO {
	List<MetaDTO> metaData;
	List<Map<String, Object>> rowData;

	public List<Map<String, Object>> deepCloneList(List<Map<String, Object>> rowData) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		for (Map<String, Object> row : rowData) {
			Map<String, Object> newRow = new HashMap<String, Object>();
			for (Map.Entry<String, Object> entry : row.entrySet()) {
				newRow.put(entry.getKey(), entry.getValue());
			}
			list.add(newRow);
		}

		return list;
	}
}