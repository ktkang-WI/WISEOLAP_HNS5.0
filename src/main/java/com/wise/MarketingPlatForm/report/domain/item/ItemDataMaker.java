package com.wise.MarketingPlatForm.report.domain.item;

import java.util.List;
import java.util.Map;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;

public interface ItemDataMaker {
  public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data);
}
