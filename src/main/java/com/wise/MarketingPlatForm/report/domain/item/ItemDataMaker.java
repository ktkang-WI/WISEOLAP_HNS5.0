package com.wise.MarketingPlatForm.report.domain.item;

import java.util.List;
import java.util.Map;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;

public interface ItemDataMaker {

    /**
     * 아이템에 맞게 데이터를 가공하여 반환합니다.
     * 
     * @param dataAggreagtion
     * @param data
     * @return result
     */
    public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data);
}
