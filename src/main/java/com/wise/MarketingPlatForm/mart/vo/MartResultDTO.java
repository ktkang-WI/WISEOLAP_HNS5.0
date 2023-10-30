package com.wise.MarketingPlatForm.mart.vo;

import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MartResultDTO {
	List<MetaDTO> metaData;
	List<Map<String, Object>> rowData;
}
