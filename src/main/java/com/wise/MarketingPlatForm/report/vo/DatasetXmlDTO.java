package com.wise.MarketingPlatForm.report.vo;

import java.util.List;
import com.wise.MarketingPlatForm.dataset.type.DataSetType;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.dataset.vo.RootFieldVO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DatasetXmlDTO {
	String datasetSeq;
	String datasetNm;
	Integer dataSrcId;
	DsType datasrcType;
	DataSetType datasetType;
	List<RootFieldVO> datasetField;
	String datasetXml;
	String datasetQuery;
}
