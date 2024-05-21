package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.Map;
import java.util.Set;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;

public class ArcDataMaker implements ItemDataMaker {
    @Override
    public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data) {
        List<Measure> measures = dataAggreagtion.getOriginalMeasures();
        List<Dimension> dimensions = dataAggreagtion.getDimensions();
        List<Measure> sortByItems = dataAggreagtion.getSortByItems();

        DataSanitizer sanitizer = new DataSanitizer(data, measures, dimensions, sortByItems);

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

        List<Map<String, Object>> nodes = new ArrayList<> ();
        List<Map<String, Object>> links = new ArrayList<> ();

        for (int i = 0; i < dimensions.size(); i++) {
            String targetName = dimensions.get(i).getName();
            Set<String> names = new LinkedHashSet<>();

            for (Map<String, Object> row : data) {
                names.add(row.get(targetName).toString());
        
                for (int j = i + 1; j < dimensions.size(); j++) {
                    String sourceName = dimensions.get(j).getName();
                    Map<String, Object> link = new HashMap<>();

                    link.put("target", row.get(targetName));
                    link.put("source", row.get(sourceName));
                    links.add(link);
                }
            }

            for (String name : names) {
                Map<String, Object> node = new HashMap<>();

                node.put("id", name);
                node.put("group", i);
                nodes.add(node);
            }
        }

        Map<String, Object> info = new HashMap<> ();

        info.put("nodes", nodes);

        CommonResult result = new CommonResult(links, "", info);

        return result;
    }
}
