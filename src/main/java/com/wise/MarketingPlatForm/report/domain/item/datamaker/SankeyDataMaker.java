package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.Map;
import java.util.Set;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;

import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;
import com.wise.MarketingPlatForm.report.domain.data.custom.DataPickUpMake;

public class SankeyDataMaker implements ItemDataMaker {
    @Override
    public ReportResult make(DataAggregation dataAggregation, List<Map<String, Object>> data) {
        List<Measure> temporaryMeasures = dataAggregation.getMeasures();
        List<Measure> measures = dataAggregation.getOriginalMeasures();
        List<Dimension> dimensions = dataAggregation.getDimensions();
        List<Measure> sortByItems = dataAggregation.getSortByItems();
        boolean isCube = dataAggregation.getDataset().getDsType() == DsType.CUBE;

        DataSanitizer sanitizer = new DataSanitizer(data, measures, dimensions, sortByItems, isCube);

        List<Measure> allMeasure = new ArrayList<>();

        allMeasure.addAll(measures);
        allMeasure.addAll(sortByItems);

        // 데이터 기본 가공
        data = sanitizer
                .dataFiltering(dataAggregation.getFilter())
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

        String meaName = measures.get(0).getSummaryName();
        Map<String, Map<String, Object>> linkMap = new LinkedHashMap<>();
        
        for (Map<String, Object> row : data) {
            for (int j = 1; j < dimensions.size(); j++) {
                String sourceName = dimensions.get(j - 1).getName();
                String targetName = dimensions.get(j).getName();
        
                Object source = row.get(sourceName);
                Object target = row.get(targetName);
                BigDecimal weight = (BigDecimal) row.getOrDefault(meaName, BigDecimal.ZERO);
        
                String key = source + "-" + target;
        
                Map<String, Object> link = linkMap.getOrDefault(key, new HashMap<>());
                link.put("source", source);
                link.put("target", target);
        
                BigDecimal currentWeight = (BigDecimal) link.getOrDefault("weight", BigDecimal.ZERO);
                link.put("weight", currentWeight.add(weight));
        
                linkMap.put(key, link);
            }
        }
        
        List<Map<String, Object>> links = new ArrayList<>(linkMap.values());

        Map<String, Object> info = new HashMap<>();

        CommonResult result = new CommonResult(links, info);

        return result;
    }
}
