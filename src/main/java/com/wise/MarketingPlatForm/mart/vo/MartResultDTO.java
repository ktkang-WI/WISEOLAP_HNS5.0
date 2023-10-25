package com.wise.MarketingPlatForm.mart.vo;

import java.util.HashMap;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MartResultDTO {
	List<MetaDTO> metaData;
	List<HashMap<String, Object>> rowData;
}
