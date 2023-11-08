package com.wise.MarketingPlatForm.report.vo;

import java.util.List;

import com.wise.MarketingPlatForm.report.domain.data.data.GridField;
import com.wise.MarketingPlatForm.report.domain.data.data.SparkLine;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class DataGridFieldVO extends RootFieldVO{
	List<GridField> field;
	List<SparkLine> sparkline;
}
