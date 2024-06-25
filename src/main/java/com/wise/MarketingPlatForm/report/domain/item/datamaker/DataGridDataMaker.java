package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;
import com.wise.MarketingPlatForm.report.domain.data.custom.DataPickUpMake;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.PagingOption;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;

public class DataGridDataMaker implements ItemDataMaker {
    @Override
    public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data) {
        List<Measure> temporaryMeasures = dataAggreagtion.getMeasures();
        List<Measure> measures = dataAggreagtion.getOriginalMeasures();
        List<Dimension> dimensions = dataAggreagtion.getDimensions();
        List<Measure> sortByItems = dataAggreagtion.getSortByItems();
        PagingOption pagingOption = dataAggreagtion.getPagingOption();

        DataSanitizer sanitizer = new DataSanitizer(data, temporaryMeasures, dimensions, sortByItems);

        data = sanitizer
                .dataFiltering(dataAggreagtion.getFilter())
                .groupBy()
                .topBottom()
                .orderBy()
                .columnFiltering()
                .paging(pagingOption)
                .getData();

        DataPickUpMake customData = new DataPickUpMake(data);
        List<Map<String, Object>> tempData = customData.executer(dimensions, temporaryMeasures);
        if(tempData != null) {
            data = tempData;
        }

        Map<String, Object> info = new HashMap<String, Object>();
        info.put("maxPage", sanitizer.getMaxPage());
        info.put("totalRows", sanitizer.getGrpDataLenth());
        CommonResult result = new CommonResult(data, info);

        return result;
    }
}
