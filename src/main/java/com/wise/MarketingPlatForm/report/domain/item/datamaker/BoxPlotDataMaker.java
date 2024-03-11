package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;

public class BoxPlotDataMaker implements ItemDataMaker {
    @Override
    public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data) {
        List<Measure> measures = dataAggreagtion.getMeasures();
        List<Dimension> dimensions = dataAggreagtion.getDimensions();
        List<Measure> sortByItems = dataAggreagtion.getSortByItems();

        DataSanitizer sanitizer = new DataSanitizer(data, measures, dimensions, sortByItems);

        // 데이터 기본 가공
        data = sanitizer
                .dataFiltering(dataAggreagtion.getFilter())
                .orderBy()
                .columnFiltering()
                .getData();

        BigDecimal max = null;

        List<Map<String, Object>> boxPlotData = new ArrayList<> ();

        for (Map<String, Object> row : data) {
            for (Measure measure : measures) {
                Map<String, Object> map = new HashMap<> ();

                List<String> groups = new ArrayList<String> ();
                for (Dimension dimension : dimensions) {
                    groups.add(String.valueOf(row.get(dimension.getName())));
                }

                String valString = row.get(measure.getName()).toString();
                BigDecimal value = new BigDecimal(valString);

                if (max == null) {
                    max = value;
                } else {
                    max = max.max(value);
                }

                map.put("group", String.join(" - ", groups));
                map.put("subGroup", measure.getCaption());
                map.put("value", value);

                boxPlotData.add(map);
            }
        }

        Map<String, Object> info = new HashMap<> ();

        info.put("maxValue", max);

        CommonResult result = new CommonResult(boxPlotData, "", info);

        return result;
    }
}
