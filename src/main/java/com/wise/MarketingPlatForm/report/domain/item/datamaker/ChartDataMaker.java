package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.TopBottomInfo;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;
import com.wise.MarketingPlatForm.report.domain.data.custom.DataPickUpMake;

public class ChartDataMaker implements ItemDataMaker {
    @Override
    public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data) {
        List<Measure> measures = dataAggreagtion.getMeasures();
        List<Dimension> dimensions = dataAggreagtion.getDimensions();
        List<Measure> sortByItems = dataAggreagtion.getSortByItems();
        TopBottomInfo topBottomInfo = Objects.isNull(dataAggreagtion.getAdHocOption()) ? 
        null : dataAggreagtion.getAdHocOption().getTopBottomInfo();

        DataSanitizer sanitizer = new DataSanitizer(data, measures, dimensions, sortByItems);

        List<Measure> allMeasure = new ArrayList<>();

        allMeasure.addAll(measures);
        allMeasure.addAll(sortByItems);

        // 데이터 기본 가공
        data = sanitizer
                .dataFiltering(dataAggreagtion.getFilter())
                .groupBy()
                .replaceNullData()
                .topBottom(topBottomInfo)
                .orderBy()
                .columnFiltering()
                .getData();

        DataPickUpMake customData = new DataPickUpMake(data);
        List<Map<String, Object>> tempData = customData.executer(dimensions, measures);
        if(tempData != null) {
            data = tempData;
        }

        // 차트 데이터 가공
        List<String> dimNames = new ArrayList<>();
        List<String> dimGrpNames = new ArrayList<>();
        Set<String> dimensionGroupNames = new LinkedHashSet<>();
        List<Measure> seriesMeasureNames = new ArrayList<>();
        Map<String, Object> info = new HashMap<>();

        for (Dimension dim : dimensions) {
            // 비정형 보고서에서 조회 시, 행(row) -> 차원(dimension), 열(column) -> 차원그룹(dimensionGroup)
            if ("dimension".equals(dim.getCategory()) || "row".equals(dim.getCategory())) {
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
                row.put("arg", String.join("<br/>", args));
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
                seriesMeasureNames.add(measure);
            }
        } else {
            for (Measure measure : measures) {
                Iterator<String> iter = dimensionGroupNames.iterator();
                final boolean isThisSizeOneRow = measures.size() == 1 ? true : false;
                while (iter.hasNext()) {
                    final String name = iter.next();
                    final String SeriesName = isThisSizeOneRow ? 
                        name : name + "-" + measure.getName();

                    Measure tempMeasure = Measure.builder()
                        .caption(SeriesName)
                        .category(measure.getCategory())
                        .expression(measure.getExpression())
                        .fieldId(measure.getFieldId())
                        .name(SeriesName)
                        .summaryName(name + "-" + measure.getSummaryName())
                        .build();
                    seriesMeasureNames.add(tempMeasure);
                }
            }
        }

        info.put("seriesMeasureNames", seriesMeasureNames);

        CommonResult result = new CommonResult(data, info);

        return result;
    }

    private Map<String, Measure> generateSingleDataMap(String key, Object o) {
        Map<String, Measure> temp = new HashMap<>();
        temp.put(key, (Measure) o);
        return temp;
    }
}
