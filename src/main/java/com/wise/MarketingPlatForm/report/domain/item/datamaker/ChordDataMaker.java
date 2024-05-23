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

public class ChordDataMaker implements ItemDataMaker {
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

        Map<String, Integer> indexMap = new HashMap<>();
        List<Map<String, String>> groups = new ArrayList<>();
        int index = 0;

        // 그룹 및 인덱스 맵 생성
        for (Dimension dimension : dimensions) {
            for (Map<String, Object> map : data) {
                String value = map.get(dimension.getName()).toString();
                if (!indexMap.containsKey(value)) {
                    Map<String, String> group = new HashMap<>();
                    group.put("value", value);
                    group.put("field", dimension.getUniqueName());
                    groups.add(group);
                    indexMap.put(value, index++);
                }
            }
        }

        // 행렬 초기화
        int[][] matrix = new int[groups.size()][groups.size()];

        // 행렬 값 설정
        for (Map<String, Object> map : data) {
            for (Dimension source : dimensions) {
                String key1 = map.get(source.getName()).toString();
                matrix[indexMap.get(key1)][indexMap.get(key1)] = 1;
                
                for (Dimension target : dimensions) {
                    if (source.getFieldId().equals(target.getFieldId())) continue;
                    String key2 = map.get(target.getName()).toString();

                    matrix[indexMap.get(key1)][indexMap.get(key2)] = 1;
                }
            }
        }

        Map<String, Object> chordData = new HashMap<>();
        chordData.put("groups", groups);
        chordData.put("matrix", matrix);

        CommonResult result = new CommonResult(data, chordData);

        return result;
    }
}
