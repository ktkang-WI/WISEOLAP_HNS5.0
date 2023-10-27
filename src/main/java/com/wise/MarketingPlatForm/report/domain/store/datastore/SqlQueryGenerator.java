package com.wise.MarketingPlatForm.report.domain.store.datastore;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.store.QueryGenerator;

public class SqlQueryGenerator implements QueryGenerator {
  @Override
  public String getQuery(DataAggregation dataAggreagtion) {
    String query = dataAggreagtion.getDataset().getQuery();
    return query;
  }
}
