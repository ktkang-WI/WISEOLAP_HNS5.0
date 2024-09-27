package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;
import com.wise.MarketingPlatForm.report.domain.data.custom.DataPickUpMake;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;

public class ListBoxMaker implements ItemDataMaker {
    @Override
    public ReportResult make(DataAggregation dataAggregation, List<Map<String, Object>> datas) {
        final List<Measure> temporaryMeasures = dataAggregation.getMeasures();
        final List<Measure> measures = dataAggregation.getOriginalMeasures();
        final List<Dimension> dimensions = dataAggregation.getDimensions();
        final List<Measure> sortByItems = dataAggregation.getSortByItems();
        boolean isCube = dataAggregation.getDataset().getDsType() == DsType.CUBE;

        DataSanitizer sanitizer = new DataSanitizer(datas, temporaryMeasures, dimensions, sortByItems, isCube);

        final List<Measure> allMeasure = new ArrayList<>();

        allMeasure.addAll(measures);
        allMeasure.addAll(sortByItems);

        // 데이터 기본 가공
        datas = sanitizer
                .dataFiltering(dataAggregation.getFilter())
                .groupBy()
                .replaceNullData()
                .topBottom()
                .orderBy()
                .columnFiltering()
                .getData();

        final DataPickUpMake customData = new DataPickUpMake(datas);
        final List<Map<String, Object>> tempData = customData.executer(dimensions, temporaryMeasures);
        if (tempData != null) {
            datas = tempData;
        }

        final List<String> dimNames = dimensions
                .stream()
                .map((dim) -> dim.getName())
                .collect(Collectors.toList());

        datas = datas.stream()
                .map((row) -> generateArg(dimNames, row))
                .collect(Collectors.toList());

        final Map<String, Object> info = new HashMap<String, Object>() {
            {
                put("seriesMeasureNames", measures);
            }
        };
        final CommonResult result = new CommonResult(datas, info);

        return result;
    }

    private Map<String, Object> generateArg(List<String> dimNames, Map<String, Object> row) {
        if (dimNames.size() == 0) {
            row.put("arg", "Grand Total");
            return row;
        }

        final List<String> args = dimNames.stream()
                .map(name -> String.valueOf(row.get(name)))
                .collect(Collectors.toList());
        Collections.reverse(args);
        row.put("arg", String.join(" - ", args));
        return row;
    }
}
