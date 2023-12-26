package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.List;
import java.util.Map;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;

public class PivotGridDataMaker implements ItemDataMaker {
    @Override
    public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data) {
        CommonResult result = new CommonResult(data, "", null);
        return result;
    }
}
