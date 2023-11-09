package com.wise.MarketingPlatForm.report.vo;

import java.util.List;
import java.util.ArrayList;
import com.wise.MarketingPlatForm.report.domain.data.data.RootData;
import com.wise.MarketingPlatForm.report.domain.data.data.SparkLine;
import lombok.Builder;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class DataGridFieldVO extends RootFieldVO{
	List<RootData> field = new ArrayList<RootData>();
	List<SparkLine> sparkline = new ArrayList<SparkLine>();
}
