package com.wise.MarketingPlatForm.report.domain.store;

import java.util.List;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Parameter;

public interface QueryGenerator {
    public String getQuery(DataAggregation dataAggregation);
    public String getQuery(DataAggregation dataAggregation, String ownerNm);
    public String applyParameter(List<Parameter> parameters, String query);
}
