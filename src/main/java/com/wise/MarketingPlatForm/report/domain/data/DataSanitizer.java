package com.wise.MarketingPlatForm.report.domain.data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.PagingOption;
import com.wise.MarketingPlatForm.report.domain.data.data.TopBottomInfo;
import com.wise.MarketingPlatForm.report.type.SummaryType;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.wise.MarketingPlatForm.global.util.GroupingUtils;
import com.wise.MarketingPlatForm.global.util.StringCompareUtils;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;

@Getter
public final class DataSanitizer {
    List<Map<String, Object>> data;
    List<Measure> measures;
    List<Dimension> dimensions;
    List<Measure> sortByItems;
    List<Measure> allMeasures;
    boolean isCube;

    int orgDataLength;
    int grpDataLenth;
    int maxPage;
    TopBottomFilter topBottomFilter;

    private static final Logger logger = LoggerFactory.getLogger(DataSanitizer.class);

    @Getter
    @AllArgsConstructor
    class Sort {
        String sortOrder;
        String sortBy;
    }

    public DataSanitizer(List<Map<String, Object>> data, List<Measure> measures, List<Dimension> dimensions,
            List<Measure> sortByItems, boolean isCube) {
        this.data = data;
        this.measures = measures;
        this.dimensions = dimensions;
        this.sortByItems = sortByItems;
        this.isCube = isCube;

        allMeasures = new ArrayList<>();
        allMeasures.addAll(measures);
        allMeasures.addAll(sortByItems);
        topBottomFilter = new TopBottomFilter(dimensions, allMeasures);

        orgDataLength = data.size();
    }

    final Set<String> getAllColumnNamesExceptSortByItem() {
        Set<String> columnNames = new HashSet<>();

        // 사용하는 컬럼 이름만 담기
        for (Measure measure : measures) {
            if (StringUtils.isNotBlank(measure.getSummaryName())) {
                columnNames.add(measure.getSummaryName());
            } else {
                columnNames.add(measure.getName());
            }
        }

        for (Dimension dimension : dimensions) {
            columnNames.add(dimension.getName());
        }

        return columnNames;
    }

    final Set<String> getAllColumnNames() {
        Set<String> columnNames = new HashSet<>();

        // 사용하는 컬럼 이름만 담기
        for (Measure measure : measures) {
            if (StringUtils.isNotBlank(measure.getSummaryName())) {
                columnNames.add(measure.getSummaryName());
            } else {
                columnNames.add(measure.getName());
            }
        }

        for (Measure measure : sortByItems) {
            if (StringUtils.isNotBlank(measure.getSummaryName())) {
                columnNames.add(measure.getSummaryName());
            } else {
                columnNames.add(measure.getName());
            }
        }

        for (Dimension dimension : dimensions) {
            columnNames.add(dimension.getName());
        }

        return columnNames;
    }

    /**
     * Top/Bottom을 적용합니다.
     * groupBy()하는 데이터의 경우 topBottom() 사용 이후 한 번 더 groupBy()를 호출하는 것을 추천드립니다.
     * @return DataSanitizer
     */
    public final DataSanitizer topBottom() {
        data = topBottomFilter.applyTopBottom(data);

        grpDataLenth = data.size();
        return this;
    }

    public final DataSanitizer topBottom(TopBottomInfo topBottomInfo) {
        if (topBottomInfo != null && 
        	(topBottomInfo.getApplyFieldId() != null && !"".equals(topBottomInfo.getApplyFieldId()))) {
            data = topBottomInfo.getTopBottomData(data, measures, dimensions);
        }

        return this;
    }

    public final DataSanitizer temporaryColumnsAdd() {
        List<Measure> cleanedMeasures = measures
            .stream()
            .filter(m -> data
                    .stream()
                    .anyMatch(item -> !item.containsKey(m.getName())))
                    .collect(Collectors.toList());
        data
            .stream()
            .forEach((d)-> {
                cleanedMeasures
                .forEach((fm) -> {
                        d.put(fm.getName(), "");
                    });
            });
        return this;
    }
    /**
     * 차원(Dimension) 이름을 기준으로 데이터를 그룹화하여 측정값(Measure)을 집계합니다.
     * 이 과정에서 "SummaryType_측정값명"으로 집계 컬럼이 추가됩니다.
     *
     * @return DataSanitizer
     */
    public final DataSanitizer groupBy() {


        data = data.stream().collect(Collectors
        .groupingBy(GroupingUtils.groupingDimensionsMapper(dimensions)))
        .entrySet()
        .stream()
                .map(e -> e.getValue().stream()
                        .reduce(new HashMap<String, Object>(), (acc, row) -> {

                            // 그룹화 된 값을 집계 기준으로 측정값을 변경
                            if (acc.keySet().size() == 0) {
                                acc = row;

                                for (Measure measure : allMeasures) {
                                    String name = measure.getName();
                                    Object value = row.get(name);
                                    measure.setSummaryName(measure.getSummaryType().toString() + "_" + name);
                                    
                                    SummaryType summaryType = measure.getSummaryType();

                                    if (isCube && (summaryType == SummaryType.COUNT || summaryType == SummaryType.COUNTDISTINCT)) {
                                        summaryType = SummaryType.SUM;
                                    }

                                    if (value == null) {
                                        acc.put(measure.getSummaryName(), null);
                                    } else {
                                        acc.put(measure.getSummaryName(),
                                                new SummaryCalculator(summaryType, value));
                                    }

                                }
                            } else {
                                for (Measure measure : allMeasures) {
                                    String name = measure.getName();
                                    Object value = row.get(name);
                                    SummaryType summaryType = measure.getSummaryType();

                                    if (isCube && (summaryType == SummaryType.COUNT || summaryType == SummaryType.COUNTDISTINCT)) {
                                        summaryType = SummaryType.SUM;
                                    }
                                    
                                    if (value != null) {
                                        if (acc.get(measure.getSummaryName()) != null) {
                                            SummaryCalculator sv = (SummaryCalculator) acc
                                                    .get(measure.getSummaryName());
                                            acc.put(measure.getSummaryName(), sv.calculateSummaryValue(value));
                                        } else {
                                            acc.put(measure.getSummaryName(),
                                                    new SummaryCalculator(summaryType, value));
                                        }
                                    }
                                }
                            }
                            return acc;
                        }))
                .map((row) -> {
                    for (Measure measure : allMeasures) {
                        String name = measure.getSummaryName();
                        if (row.get(name) != null && row.get(name) instanceof SummaryCalculator) {
                            SummaryCalculator sv = (SummaryCalculator) row.get(name);

                            row.put(name, sv.getSummaryValue());
                        }
                    }
                    return row;
                })
                .collect(Collectors.toList());

        grpDataLenth = data.size();
        return this;
    }

    /**
     * <p>
     * 필요한 컬럼의 데이터만 필터링합니다.
     * </p>
     * 차원(Dimension)의 경우 name으로 된 데이터가 남습니다.
     * 측정값(Measure)의 경우 groupBy()를 실행했던 데이터라면 집계 컬럼(SummaryType_측정값명)이 남고, 아니라면
     * name으로 된 데이터가 남습니다.
     *
     * @return DataSanitizer
     */
    public final DataSanitizer columnFiltering() {
        return columnFiltering(false);
    }

    /**
     * <p>
     * 필요한 컬럼의 데이터만 필터링합니다.
     * </p>
     * 차원(Dimension)의 경우 name으로 된 데이터가 남습니다.
     * 측정값(Measure)의 경우 groupBy()를 실행했던 데이터라면 집계 컬럼(SummaryType_측정값명)이 남고, 아니라면
     * name으로 된 데이터가 남습니다.
     *
     * @param includeSortByItem sortByItem을 포함 할지 여부입니다.
     * @return DataSanitizer
     */
    public final DataSanitizer columnFiltering(boolean includeSortByItem) {
        Set<String> columnNames;
        if (includeSortByItem) {
            columnNames = getAllColumnNames();
        } else {
            columnNames = getAllColumnNamesExceptSortByItem();
        }

        data.forEach(map -> {
            map.keySet().retainAll(columnNames);
        });

        return this;
    }

    /**
     * null값이 포함된 row가 있을 경우 해당 row를 삭제합니다.
     *
     * @return DataSanitizer
     */
    public final DataSanitizer removeNullData() {
        for (Map<String, Object> map : data) {
            Iterator<Map.Entry<String, Object>> iterator = map.entrySet().iterator();
    
            while (iterator.hasNext()) {
                Map.Entry<String, Object> entry = iterator.next();
    
                if (entry.getValue() == null) {
                    iterator.remove(); // null 값이 있는 key만 제거
                }
            }
        }
    
        return this;
    }

    /**
     * null값이 포함된 row가 있을 경우 해당 row를 빈 문자열로 바꿉니다.
     *
     * @return DataSanitizer
     */
    public final DataSanitizer replaceNullData() {
        for (Map<String, Object> map : data) {
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                if (entry.getValue() == null) {
                    entry.setValue("\u2800");
                }
            }
        }
        return this;
    }

    /**
     * <p>
     * 데이터를 차원(Dimension)의 sortBy와 sortOrder 값을 사용해서 정렬합니다.
     * 차원의 index가 낮을 수록 높은 우선순위를 가집니다.
     * </p>
     * <p>
     * sortBy는 자기 자신 또는 측정값(Measure)의 fieldId를 가리키고 있습니다.
     * 차원의 경우 StringCompareUtils를 사용하여 미리 정의된 문자열 우선순위를 통해 정렬됩니다.
     * 측정값의 경우 groupBy()를 실행했던 데이터라면 집계 컬럼(SummaryType_측정값명) 기준으로 정렬되고, 아니라면 name
     * 기준으로 정렬됩니다.
     * </p>
     *
     * @return DataSanitizer
     */
    public final DataSanitizer orderBy() {
        Map<String, Measure> measureLookup = allMeasures.stream()
                .collect(Collectors.toMap(Measure::getFieldId, Function.identity()));

        List<Sort> sortByList = dimensions.stream()
                .map((dim) -> {
                    Measure measure = measureLookup.getOrDefault(dim.getSortBy(), null);
                    String sortBy;

                    if (measure != null) {
                        sortBy = StringUtils.isNotBlank(measure.getSummaryName()) ? measure.getSummaryName()
                                : measure.getName();
                    } else {
                        sortBy = dim.getName();
                    }

                    return new Sort(dim.getSortOrder(), sortBy);
                })
                .collect(Collectors.toList());

        Collections.sort(data, (o1, o2) -> {
            for (Sort sort : sortByList) {
                String name = sort.getSortBy();
                int weight = sort.getSortOrder().equals("ASC") ? 1 : -1;
                Object v1 = o1.get(name);
                Object v2 = o2.get(name);

                int compareResult = 0;

                if (v1 == null) {
                    v1 = "";
                }
                if (v2 == null) {
                    v2 = "";
                }

                if (v1 instanceof String) {
                    compareResult = StringCompareUtils.compare((String) v1, (String) v2);
                } else {
                    BigDecimal bv1 = new BigDecimal(v1.toString());
                    BigDecimal bv2 = new BigDecimal(v2.toString());
                    compareResult = (bv1).compareTo(bv2);
                }

                if (compareResult != 0) {
                    return compareResult * weight;
                }
            }

            return 0;
        });

        return this;
    }

    /**
     * 데이터를 입력된 pagingOption 만큼 자릅니다.
     *
     * @param pagingOption
     * @return DataSanitizer
     */
    public final DataSanitizer paging(PagingOption pagingOption) {
        if (pagingOption != null && pagingOption.isPagingEnabled()) {
            int start = pagingOption.getStart();
            int size = pagingOption.getSize();
            int end = Math.min(start + size, data.size());
            maxPage = data.size() / pagingOption.getSize();

            List<Map<String, Object>> tempList;

            if (start >= data.size()) {
                tempList = Collections.emptyList();
            } else {
                tempList = data.subList(start, end);
            }

            if (data.size() % pagingOption.getSize() > 0) {
                maxPage += 1;
            }

            data = tempList;
        }

        return this;
    }

    /**
     * 데이터에 필터(마스터 필터)를 적용한 결과를 반환합니다.
     * @param filter
     * @return DataSanitizer
     */
    public final DataSanitizer dataFiltering(Map<String, List<String>> filter) {
        Map<String, String> dimensionMap = dimensions.stream()
            .collect(Collectors.toMap(
                Dimension::getUniqueName,
                Dimension::getName,
                (existingValue, newValue) -> newValue
            ));

        // 필터가 존재하는 경우에만 필터링
        if (filter != null && filter.size() > 0) {
            data = data.stream()
                    .filter(map -> filter.entrySet().stream()
                            .allMatch(entry -> {
                                Object value = map.get(dimensionMap.get(entry.getKey()));
                                
                                if (value == null) {
                                    // return entry.getValue().contains(null);
                                    return true;
                                }

                                return entry.getValue().stream()
                                    .anyMatch(v -> v.equals(value.toString()));
                            }))
                    .collect(Collectors.toList());
        }

        return this;
    }
}
