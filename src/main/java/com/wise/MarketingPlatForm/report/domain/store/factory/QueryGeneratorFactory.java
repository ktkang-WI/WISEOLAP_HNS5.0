package com.wise.MarketingPlatForm.report.domain.store.factory;

import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.report.domain.store.QueryGenerator;
import com.wise.MarketingPlatForm.report.domain.store.datastore.CubeQueryGenerator;
import com.wise.MarketingPlatForm.report.domain.store.datastore.SqlQueryGenerator;

public class QueryGeneratorFactory {
    public QueryGenerator getDataStore(DsType dsType) {
        if (dsType == DsType.DS_SQL) {
            return new SqlQueryGenerator();
        }
        if (dsType == DsType.CUBE) {
            return new CubeQueryGenerator();
        }

        return null;
    }
}
