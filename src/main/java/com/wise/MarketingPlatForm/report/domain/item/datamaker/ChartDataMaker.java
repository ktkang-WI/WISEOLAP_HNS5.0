package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.Map;
import java.util.List;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;
import com.wise.MarketingPlatForm.report.util.DataSanitizer;

public class ChartDataMaker implements ItemDataMaker {
  @Override
  public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data) {
    List<Measure> measures = dataAggreagtion.getMeasures();
    List<Dimension> dimensions = dataAggreagtion.getDimensions();
    DataSanitizer sanitizer = new DataSanitizer(data);

    data = sanitizer
        .groupBy(measures, dimensions)
        .columnFiltering(measures, dimensions)
        .orderBy(dimensions)
        .getData();

    CommonResult result = new CommonResult(data, "", null);

    return result;
  }
}
