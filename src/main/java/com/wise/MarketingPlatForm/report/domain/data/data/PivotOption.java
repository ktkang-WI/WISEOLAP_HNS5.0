package com.wise.MarketingPlatForm.report.domain.data.data;

import java.util.List;

import com.google.gson.Gson;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.FilterParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.GroupParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.PagingParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.SortInfoParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.SummaryParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.TopBottomParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.UdfGroupParam;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PivotOption {
    PagingParam pagingParam;
    String showRowGrandTotals;
    String showRowTotals;
    FilterParam filterParam;
    List<UdfGroupParam> udfGroupParams;
    List<GroupParam> groupParams;
    List<SummaryParam> groupSummaryParams;
    List<SummaryParam> totalSummaryParams;
    List<SortInfoParam> sortInfoParams;
    List<TopBottomParam> topBottomParams;

    public String generateCacheKey(DataAggregation dataAggregation) {
        Gson gson = new Gson();
        return gson.toJson(this) + gson.toJson(dataAggregation);
    }
}
