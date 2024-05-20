package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.commons.math3.stat.descriptive.rank.Percentile;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;
import com.wise.MarketingPlatForm.report.domain.data.custom.DataPickUpMake;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;

import lombok.Getter;
import lombok.NoArgsConstructor;

public class BoxPlotDataMaker implements ItemDataMaker {

    @Override
    public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data) {
        List<Measure> temporaryMeasures = dataAggreagtion.getMeasures();
        List<Measure> measures = dataAggreagtion.getOriginalMeasures();
        List<Dimension> dimensions = dataAggreagtion.getDimensions();
        List<Measure> sortByItems = dataAggreagtion.getSortByItems();

        DataSanitizer sanitizer = new DataSanitizer(data, temporaryMeasures, dimensions, sortByItems);

        // 데이터 기본 가공
        data = sanitizer
                .dataFiltering(dataAggreagtion.getFilter())
                .temporaryColumnsAdd()
                .orderBy()
                .columnFiltering()
                .replaceNullData()
                .getData();

        DataPickUpMake customData = new DataPickUpMake(data);
        List<Map<String, Object>> tempData = customData.executer(dimensions, temporaryMeasures);
        if(tempData != null) {
            data = tempData;
        }
        
        List<Map<String, Object>> boxPlotData = new ArrayList<> ();

        BaseData baseData = getBaseData(measures, dimensions, data);

        Map<String, List<Double>> groupedData = baseData.getGroupedData();

        for (String key : groupedData.keySet()) {
            Map<String, Object> map = new HashMap<> ();
            List<Double> list = groupedData.get(key);

            map.put("name", key);
            map.put("data", getRowData(list));

            boxPlotData.add(map);
        }

        Map<String, Object> info = new HashMap<> ();

        info.put("min", baseData.getMin());
        info.put("max", baseData.getMax());

        CommonResult result = new CommonResult(boxPlotData, "", info);

        return result;
    }

    @NoArgsConstructor
    @Getter
    class BaseData {
        Map<String, List<Double>> groupedData = new HashMap<> ();
        double min = Double.MAX_VALUE;
        double max = Double.MIN_VALUE;

        double objectToDouble(Object value) {
            double dValue = 0;

            if (value instanceof Double) {
                dValue = (double)value;
            } else {
                dValue = Double.parseDouble(value.toString());
            }

            min = Math.min(min, dValue);
            max = Math.max(max, dValue);

            return dValue;
        }
    }

    private BaseData getBaseData(List<Measure> measures, List<Dimension> dimensions, List<Map<String, Object>> data) {
        BaseData baseData = new BaseData();

        // 데이터 그룹핑
        Map<String, List<Double>> groupedData = baseData.getGroupedData();

        for (Map<String, Object> row : data) {
            List<String> names = new ArrayList<String> ();
            for (Dimension dimension : dimensions) {
                names.add((String)row.get(dimension.getName()));
            }

            if (measures.size() > 1) {
                for (Measure measure : measures) {
                    names.add(measure.getCaption());

                    String name = String.join(" - ", names);
                    List<Double> list = groupedData.getOrDefault(name, new ArrayList<Double> ());
                    Object value = row.get(measure.getName());
                    
                    list.add(baseData.objectToDouble(value));

                    groupedData.put(name, list);

                    names.remove(names.size() - 1);
                }
            } else {
                String name = String.join(" - ", names);
                List<Double> list = groupedData.getOrDefault(name, new ArrayList<Double> ());
                Object value = row.get(measures.get(0).getName());

                list.add(baseData.objectToDouble(value));

                groupedData.put(name, list);
            }  
        }

        return baseData;
    }

    private double[] getRowData(List<Double> data) {
        // min, Q1, Q2(median), Q3, max
        double[] result = new double[5];

        DescriptiveStatistics statistics = new DescriptiveStatistics();
        statistics.setPercentileImpl(new Percentile().withEstimationType(Percentile.EstimationType.R_7));

        for (double v : data) {
            statistics.addValue(v);
        }
        
        result[0] = statistics.getMin();
        result[1] = statistics.getPercentile(25);
        result[2] = statistics.getPercentile(50);
        result[3] = statistics.getPercentile(75);
        result[4] = statistics.getMax();

        return result;
    }
}
