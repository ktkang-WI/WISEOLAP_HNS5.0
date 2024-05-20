package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;
import com.wise.MarketingPlatForm.report.domain.data.custom.DataPickUpMake;

public class TimelineDataMaker implements ItemDataMaker {
    @Override
    public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data) {
        List<Measure> temporaryMeasures = dataAggreagtion.getMeasures();
        List<Measure> measures = dataAggreagtion.getOriginalMeasures();
        List<Dimension> dimensions = dataAggreagtion.getDimensions();
        List<Measure> sortByItems = dataAggreagtion.getSortByItems();

        DataSanitizer sanitizer = new DataSanitizer(data, temporaryMeasures, dimensions, sortByItems);

        List<Measure> allMeasure = new ArrayList<>();

        allMeasure.addAll(measures);
        allMeasure.addAll(sortByItems);

        // 데이터 기본 가공
        data = sanitizer
                .dataFiltering(dataAggreagtion.getFilter())
                .replaceNullData()
                .groupBy()
                .orderBy()
                .columnFiltering()
                .getData();

        DataPickUpMake customData = new DataPickUpMake(data);
        List<Map<String, Object>> tempData = customData.executer(dimensions, temporaryMeasures);
        if(tempData != null) {
            data = tempData;
        }

        List<Map<String, Object>> timelineData = new ArrayList<> ();

        for (Map<String, Object> row : data) {
            Map<String, Object> nRow = new HashMap<String, Object> ();

            List<String> args = new ArrayList<String> ();
            List<String> groups = new ArrayList<String> ();

            for (Dimension dimension : dimensions) {
                String category = dimension.getCategory();
                String value = row.get(dimension.getName()).toString();

                if ("dimension".equals(category)) {
                    args.add(value);
                } else if ("dimensionGroup".equals(category)) {
                    groups.add(value);
                } else {
                    nRow.put(category, value);
                }
            }

            nRow.put("args", String.join("<br/>", args));
            nRow.put("groups", String.join("-", groups));

            timelineData.add(nRow);
        }

        CommonResult result = new CommonResult(timelineData, "", null);

        return result;
    }
}
