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
    public String getQuery(DataAggregation dataAggregation) {
        return getQuery(dataAggregation, "");
    }

    @Override
    public String getQuery(DataAggregation dataAggregation, String ownerNm) {
        queryGenService = BeanContext.getBean(QueryGenService.class);

        String query = queryGenService.createCubeParamSet(dataAggregation, ownerNm);
        return query;
    }

    @Override
    public String applyParameter(List<Parameter> parameters, String query) {
        // QueryGen 패키지에서 처리 Override 만 시켜 둔다.
        return null;
    }

}
