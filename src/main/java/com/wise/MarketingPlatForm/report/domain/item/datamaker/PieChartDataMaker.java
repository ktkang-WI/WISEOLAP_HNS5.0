package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;
import com.wise.MarketingPlatForm.report.domain.data.custom.DataPickUpMake;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;

public class PieChartDataMaker implements ItemDataMaker {
	@Override
	public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data) {
        List<Measure> measures = dataAggreagtion.getMeasures();
        List<Dimension> dimensions = dataAggreagtion.getDimensions();
        List<Measure> sortByItems = dataAggreagtion.getSortByItems();

        DataSanitizer sanitizer = new DataSanitizer(data, measures, dimensions, sortByItems);

        List<Measure> allMeasure = new ArrayList<>();

        allMeasure.addAll(measures);
        allMeasure.addAll(sortByItems);

        // 데이터 기본 가공
        data = sanitizer
                .dataFiltering(dataAggreagtion.getFilter())
                .groupBy()
                .orderBy()
                .columnFiltering()
                .getData();

        DataPickUpMake customData = new DataPickUpMake(data);

        // 사용자 정의 데이터 가공
        List<Map<String, Object>> tempData = null;
        try {
            tempData = customData.setDimension(dimensions)
                         .setMeasure(measures)
                         .builder();
        } catch (Exception e) {
            e.printStackTrace();
            tempData = null;
        }

        if(tempData != null) {
            data = tempData;
        }

        // 차트 데이터 가공
        List<String> dimNames = new ArrayList<>();
        List<String> dimGrpNames = new ArrayList<>();
        Set<String> dimensionGroupNames = new LinkedHashSet<>();
        List<Map<String, String>> seriesDimensionNames = new ArrayList<>();
        Map<String, Object> info = new HashMap<>();

        for (Dimension dim : dimensions) {
            if ("dimension".equals(dim.getCategory())) {
                dimNames.add(dim.getName());
            } else {
                dimGrpNames.add(dim.getName());
            }
        }

        for (Map<String, Object> row : data) {
            if (dimNames.size() == 0) {
                row.put("arg", "Grand Total");
            }

            if (dimNames.size() == 1) {
                row.put("arg", row.get(dimNames.get(0)));
            }

            if (dimNames.size() >= 2) {
                List<String> args = new ArrayList<>();
                for (String name : dimNames) {
                    args.add(String.valueOf(row.get(name)));
                }
                Collections.reverse(args);
                row.put("arg", String.join(",", args));
            }

            if (dimGrpNames.size() > 0) {
                List<String> args = new ArrayList<>();
                for (String name : dimGrpNames) {
                    args.add(String.valueOf(row.get(name)));
                }

                String argStr = String.join("-", args);
                dimensionGroupNames.add(argStr);

                for (Measure measure : measures) {
                    StringBuilder sb = new StringBuilder(argStr);
                    sb.append("-");
                    sb.append(measure.getSummaryName());

                    row.put(sb.toString(), row.get(measure.getSummaryName()));
                    row.remove(measure.getSummaryName());
                }
            }
        }

        if (dimGrpNames.size() == 0) {
            for (Measure measure : measures) {
                Map<String,String> seriesDimensions = new HashMap<>();
                String caption = measure.getCaption() != null ?  measure.getCaption():  measure.getName();

                seriesDimensions.put("summaryName", measure.getSummaryName());
                seriesDimensions.put("caption", caption);
                seriesDimensionNames.add(seriesDimensions);
            }
        } else {
            for (Measure measure : measures) {
                Iterator<String> iter = dimensionGroupNames.iterator();
                String caption = measure.getCaption() != null ?  measure.getCaption():  measure.getName();
                
                while (iter.hasNext()) {
                    String name = iter.next();
                    Map<String,String> seriesDimensions = new HashMap<>();

                    seriesDimensions.put("summaryName", name + "-" + measure.getSummaryName());
                    seriesDimensions.put("caption", name + "-" + caption);
                    seriesDimensionNames.add(seriesDimensions);
                }
            }
        }

        info.put("seriesDimensionNames", seriesDimensionNames);

        CommonResult result = new CommonResult(data, "", info);

        return result;
	}
}
