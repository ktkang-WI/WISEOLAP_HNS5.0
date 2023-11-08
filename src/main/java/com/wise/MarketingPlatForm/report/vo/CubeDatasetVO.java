package com.wise.MarketingPlatForm.report.vo;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class CubeDatasetVO extends RootDataSetVO{
	String cubeDesc;
	int cubeId;
	String cubeNm;
	int dsViewId;
	int ordinal;
}
