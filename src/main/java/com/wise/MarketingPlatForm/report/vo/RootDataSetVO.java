package com.wise.MarketingPlatForm.report.vo;

import java.util.List;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.dataset.vo.RootFieldVO;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class RootDataSetVO {
	String datasetId;
	String datasetNm;
	DsType datasetType;
	List<RootFieldVO> fields;
}
