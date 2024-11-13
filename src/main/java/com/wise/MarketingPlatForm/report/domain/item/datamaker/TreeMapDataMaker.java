package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.math.BigDecimal;
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

public class TreeMapDataMaker implements ItemDataMaker {
    int idCounter = 1;

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
        List<Measure> seriesMeasureNames = new ArrayList<>();
        Map<String, Object> info = new HashMap<>();

        for (Dimension dim : dimensions) {
            dimNames.add(dim.getName());
        }

        data = convertToTreeMapData(data, dimNames, measures.get(0).getSummaryName());

        for (Measure measure : measures) {
            seriesMeasureNames.add(measure);
        }

        info.put("seriesMeasureNames", seriesMeasureNames);
        CommonResult result = new CommonResult(data, info);

        return result;
    }

    public List<Map<String, Object>> convertToTreeMapData(
            List<Map<String, Object>> data, List<String> groupFields, String valueField) {
        
        List<Map<String, Object>> result = new ArrayList<>();
        convertGroup(data, groupFields, valueField, 0, null, result);
        
        return result;
    }

    private void convertGroup(
            List<Map<String, Object>> data, List<String> groupFields, String valueField,
            int groupIdx, String parentId, List<Map<String, Object>> result) {
        
        if (groupIdx >= groupFields.size()) return;
        
        String currentGroupField = groupFields.get(groupIdx);
        
        Map<Object, List<Map<String, Object>>> groupedData = data.stream()
                .collect(Collectors.groupingBy(item -> item.get(currentGroupField)));
        
        for (Map.Entry<Object, List<Map<String, Object>>> entry : groupedData.entrySet()) {
            Map<String, Object> groupNode = new HashMap<>();
            Map<String, Object> item = entry.getValue().get(0);
            String currentId = String.valueOf(idCounter++);
            
            groupNode.put("id", currentId);
            groupNode.put("name", entry.getKey());

            
            String args = groupFields.stream()
                .limit(groupIdx + 1)
                .map(field -> String.valueOf(item.get(field)))
                .collect(Collectors.joining(" - "));
        
            groupNode.put("args", args);
            
            if (parentId != null) {
                groupNode.put("parentId", parentId);
            }
            
            if (groupIdx < groupFields.size() - 1) {
                convertGroup(entry.getValue(), groupFields, valueField, groupIdx + 1, currentId, result);
            } else {
                groupNode.put("value", new BigDecimal(String.valueOf(item.get(valueField))));
                groupNode.put("originalData", item);
            }
            
            result.add(groupNode);
        }
    }
}
