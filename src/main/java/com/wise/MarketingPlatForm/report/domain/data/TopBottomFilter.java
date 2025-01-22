package com.wise.MarketingPlatForm.report.domain.data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import com.wise.MarketingPlatForm.data.list.FileBackedMapList;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.TopBottom;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class TopBottomFilter {
    private final String SPLITTER = "~SPLIT~";

    List<Dimension> dimensions;
    List<Measure> measures;

    private List<TopBottom> getTopBottomList() {
        List<TopBottom> topBottomList = new ArrayList<>();
        String pervCategory = "";
        int depth = 0;
        String depthNames = "";

        for (Dimension dim : dimensions) {
            // 카테고리 바뀔 때마다 depth 0으로 초기화
            if (!dim.getCategory().equals(pervCategory)) {
                depth = 0;
                pervCategory = dim.getCategory();
                depthNames = "";
            }

            if (dim.getTopBottom() != null) {
                dim.getTopBottom().setDepth(depth);
                dim.getTopBottom().setDepthNames(depthNames);
                topBottomList.add(dim.getTopBottom());
            }
            depth++;
            depthNames += dim.getName() + SPLITTER;
        }

        return topBottomList;
    }

    public List<Map<String, Object>> applyTopBottom(List<Map<String, Object>> data) {
        List<TopBottom> topBottomList = getTopBottomList();

        for (TopBottom topBottom : topBottomList) {
            data = applySingleTopBottom(data, topBottom);
        }

        return data;
    }

    private List<Map<String, Object>> applySingleTopBottom(List<Map<String, Object>> data, TopBottom topBottom) {
        final String[] names = topBottom.getDepthNames().split(SPLITTER);

        // applyField depth - 1까지 groupBy
        // ex). 생산회사이름 - 자동차명 - 결재구분명에서 결재구분명이 applyField면 자동차명까지 group by)
        Map<String, List<Map<String, Object>>> groupedData = data.stream()
                .collect(Collectors.groupingBy(entry -> {
                    StringBuilder sb = new StringBuilder();

                    for (String name : names) {
                        sb.append(String.valueOf(entry.get(name)));
                        sb.append(SPLITTER);
                    }

                    return sb.toString();
                }));

        // TopBottom이 적용된 데이터 배열
        // 이 때 정렬이 흐트러짐으로 orderBy 이전에 호출해야 함.
        List<Map<String, Object>> result = new FileBackedMapList();

        String target = getTarget(topBottom.getTarget());

        topBottom.setTarget(target);

        for (Map.Entry<String, List<Map<String, Object>>> entry : groupedData.entrySet()) {
            List<Map<String, Object>> group = entry.getValue();
            List<Map<String, Object>> othersList = new FileBackedMapList();

            // depth - 1까지 그룹된 데이터 안에서 각각 top/bottom 계산
            Map<Object, List<Map<String, Object>>> sumByGroup = group.stream()
                    .collect(
                            Collectors.groupingBy(
                                    entry2 -> entry2.get(topBottom.getApplyField())));

            Map<Object, BigDecimal> sumMap = new HashMap<>();
            sumByGroup.forEach((key, list) -> {
                BigDecimal sum = list.stream()
                        .map(entry2 -> (BigDecimal) entry2.get(topBottom.getTarget()))
                        .filter(value -> value != null) // null 값 필터링
                        .reduce(BigDecimal.ZERO, BigDecimal::add); // 합계 계산
                sumMap.put(key, sum);
            });
            
            // 값을 기준으로 내림차순으로 정렬
            List<Map.Entry<Object, BigDecimal>> sortedEntries = sortEntries(topBottom.getType(), sumMap);

            // Percentage 사용하는 경우 차원 개수 계산
            int limit = calculateLimit(topBottom.getCount(), topBottom.isPercentage(), sortedEntries.size());

            List<Map.Entry<Object, BigDecimal>> topBottomEntries = sortedEntries.stream().limit(limit)
                    .collect(Collectors.toList());

            result.addAll(topBottomEntries.stream()
                    .flatMap(entry2 -> sumByGroup.get(entry2.getKey()).stream())
                    .collect(Collectors.toList()));

            // 기타 데이터 계산
            if (topBottom.isOthers()) {
                List<Map.Entry<Object, BigDecimal>> otherEntries = sortedEntries.stream().skip(limit)
                        .collect(Collectors.toList());

                othersList.addAll(otherEntries.stream()
                        .flatMap(entry2 -> sumByGroup.get(entry2.getKey()).stream())
                        .collect(Collectors.toList()));

                if (!othersList.isEmpty()) {
                    // applyField를 제외한 다른 필드를 모두 group by
                    // SUM으로 합산한 뒤 반환

                    othersList = othersList.stream().collect(
                            Collectors.groupingBy(row -> {
                                StringBuilder sb = new StringBuilder();

                                for (Dimension dimension : dimensions) {
                                    if (!dimension.getName().equals(topBottom.getApplyField())) {
                                        sb.append(String.valueOf(row.get(dimension.getName())));
                                        sb.append("-wise-split-");
                                    }
                                }

                                return sb.toString();
                            }))
                            .entrySet()
                            .stream()
                            .map(e -> e.getValue().stream()
                                    .reduce(new HashMap<String, Object>(), (acc, row) -> {
                                        if (acc.size() == 0) {
                                            acc = row;
                                            acc.put(topBottom.getApplyField(), "기타");
                                        }

                                        for (Measure measure : measures) {
                                            String name = measure.getSummaryName() == null ? measure.getName()
                                                    : measure.getSummaryName();
                                            BigDecimal value = (BigDecimal) row.get(name);
                                            
                                            acc.put(name,
                                                    ((BigDecimal) acc.getOrDefault(name, BigDecimal.ZERO)).add(value));

                                        }
                                        return acc;
                                    }))
                            .collect(Collectors.toList());

                    result.addAll(othersList);
                }
            }
        }

        return result;
    }

    private int calculateLimit(int count, boolean percentage, int size) {
        if (percentage) {
            return (int) Math.ceil(size * (count / 100.0));
        } else {
            return count;
        }
    }

    private List<Entry<Object, BigDecimal>> sortEntries(String type, Map<Object, BigDecimal> sumMap) {
        if ("TOP".equals(type)) {
            // 내림차순 정렬
            return sumMap.entrySet().stream()
                    .sorted(Collections.reverseOrder(Map.Entry.comparingByValue()))
                    .collect(Collectors.toList());
        } else {
            // 오름차순 정렬
            return sumMap.entrySet().stream()
                    .sorted(Map.Entry.comparingByValue())
                    .collect(Collectors.toList());
        }
    }

    /**
     * topBottom의 target이 fieldId인 경우 measure name 탐색해서 반환
     * 
     * @param targetId
     * @return
     */
    private String getTarget(String targetId) {
        for (Measure measure : measures) {
            if (targetId.equals(measure.getFieldId())) {
                if (measure.getSummaryName() != null) {
                    return measure.getSummaryName();
                }

                return measure.getName();
            }
        }

        return targetId;
    }
}