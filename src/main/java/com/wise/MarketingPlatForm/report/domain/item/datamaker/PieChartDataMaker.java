package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.wise.MarketingPlatForm.dataset.type.DsType;
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
    public ReportResult make(DataAggregation dataAggregation, List<Map<String, Object>> data) {
        List<Measure> temporaryMeasures = dataAggregation.getMeasures();
        List<Measure> measures = dataAggregation.getOriginalMeasures();
        List<Dimension> dimensions = dataAggregation.getDimensions();
        List<Measure> sortByItems = dataAggregation.getSortByItems();
        boolean isCube = dataAggregation.getDataset().getDsType() == DsType.CUBE;

        DataSanitizer sanitizer = new DataSanitizer(data, temporaryMeasures, dimensions, sortByItems, isCube);

        List<Measure> allMeasure = new ArrayList<>();

        allMeasure.addAll(measures);
        allMeasure.addAll(sortByItems);

        // 데이터 기본 가공
        data = sanitizer
                .dataFiltering(dataAggregation.getFilter())
                .groupBy()
                .replaceNullData()
                .topBottom()
                .orderBy()
                .columnFiltering()
                .getData();

        DataPickUpMake customData = new DataPickUpMake(data);
        List<Map<String, Object>> tempData = customData.executer(dimensions, temporaryMeasures);
        if (tempData != null) {
            data = tempData;
        }

        // 차트 데이터 가공
        List<String> dimNames = new ArrayList<>();
        List<String> dimGrpNames = new ArrayList<>();
        Set<String> dimensionGroupNames = new LinkedHashSet<>();
        List<Map<String, String>> seriesMeasureNames = new ArrayList<>();
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

                String argStr = String.join(" - ", args);
                dimensionGroupNames.add(argStr);

                for (Measure measure : measures) {
                    StringBuilder sb = new StringBuilder(argStr);
                    sb.append(" - ");
                    sb.append(measure.getSummaryName());

                    row.put(sb.toString(), row.get(measure.getSummaryName()));
                    row.remove(measure.getSummaryName());
                }
            }
        }

        if (dimGrpNames.size() == 0) {
            for (Measure measure : measures) {
                Map<String, String> seriesMeasures = new HashMap<>();
                String caption = measure.getCaption() != null ? measure.getCaption() : measure.getName();

                seriesMeasures.put("summaryName", measure.getSummaryName());
                seriesMeasures.put("caption", caption);
                seriesMeasureNames.add(seriesMeasures);
            }
        } else {
            for (Measure measure : measures) {
                Iterator<String> iter = dimensionGroupNames.iterator();
                String caption = measure.getCaption() != null ? measure.getCaption() : measure.getName();

                while (iter.hasNext()) {
                    String name = iter.next();
                    Map<String, String> seriesMeasures = new HashMap<>();

                    seriesMeasures.put("summaryName", name + " - " + measure.getSummaryName());
                    seriesMeasures.put("caption", name + "-" + caption);
                    seriesMeasureNames.add(seriesMeasures);
                }
            }
        }

        info.put("seriesMeasureNames", seriesMeasureNames);

        CommonResult result = new CommonResult(data, info);

        return result;
    }
}
