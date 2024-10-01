package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.math.BigDecimal;
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

public class ScatterPlotMaker implements ItemDataMaker {
    @Override
    public ReportResult make(DataAggregation dataAggregation, List<Map<String, Object>> datas) {
        List<Measure> temporaryMeasures = dataAggregation.getMeasures();
        List<Measure> measures = dataAggregation.getOriginalMeasures();
        List<Dimension> dimensions = dataAggregation.getDimensions();
        List<Measure> sortByItems = dataAggregation.getSortByItems();
        boolean isCube = dataAggregation.getDataset().getDsType() == DsType.CUBE;

        DataSanitizer sanitizer = new DataSanitizer(datas, temporaryMeasures, dimensions, sortByItems, isCube);

        // 데이터 기본 가공
        datas = sanitizer
                .dataFiltering(dataAggregation.getFilter())
                .temporaryColumnsAdd()
                .replaceNullData()
                .orderBy()
                .columnFiltering()
                .getData();

        DataPickUpMake customData = new DataPickUpMake(datas);
        List<Map<String, Object>> tempData = customData.executer(dimensions, temporaryMeasures);
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

        datas = datas.stream()
                .map((d) -> {
                    BigDecimal yValue = null;
                    BigDecimal xValue = null;
                    for (Measure measure : measures) {
                        if (measure.getCategory().equals("x")) {
                            xValue = new BigDecimal(d.get(measure.getName()).toString());
                        }
                        if (measure.getCategory().equals("y")) {
                            yValue = new BigDecimal(d.get(measure.getName()).toString());
                        }
                    }
                    Map<String, Object> data = new HashMap<>();
                    data.put("x", xValue);
                    data.put("y", yValue);
                    data.put("name", d.get("arg"));

                    return data;
                })
                .collect(Collectors.toList());

        Map<String, Object> info = new HashMap<>();
        CommonResult result = new CommonResult(datas, info);

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
