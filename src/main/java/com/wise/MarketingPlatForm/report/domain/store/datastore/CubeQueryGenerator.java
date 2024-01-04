package com.wise.MarketingPlatForm.report.domain.store.datastore;

import java.util.List;

import com.wise.MarketingPlatForm.querygen.service.QueryGenService;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Parameter;
import com.wise.MarketingPlatForm.report.domain.store.QueryGenerator;

import com.wise.MarketingPlatForm.global.context.BeanContext;

public class CubeQueryGenerator implements QueryGenerator {

    private QueryGenService queryGenService;

    @Override
    public String getQuery(DataAggregation dataAggreagtion) {
        queryGenService = BeanContext.getBean(QueryGenService.class);
        String query = queryGenService.createCubeQuery(dataAggreagtion);
        return query;
    }

    @Override
    public String applyParameter(List<Parameter> parameters, String query) {
        // TODO Auto-generated method stub
        return null;
    }

}
