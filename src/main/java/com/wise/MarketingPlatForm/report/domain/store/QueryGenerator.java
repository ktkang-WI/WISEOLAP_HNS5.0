package com.wise.MarketingPlatForm.report.domain.store;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;

public interface QueryGenerator {
  public String getQuery(DataAggregation dataAggreagtion);
}
