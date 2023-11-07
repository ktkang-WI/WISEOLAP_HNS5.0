package com.wise.MarketingPlatForm.report.vo;

import java.util.List;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.dataset.vo.DatasetFieldVO;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class RootDataSetVO {
	int datasetId;
	String datasetNm;
	DsType datsetType;
	List<DatasetFieldVO> fields;
}
