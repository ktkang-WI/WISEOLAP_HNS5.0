package com.wise.MarketingPlatForm.report.domain.data;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.PagingOption;

import lombok.Getter;

import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;

@Getter
public final class DataSanitizer {
    List<Map<String, Object>> data;
    int orgDataLength;
    int grpDataLenth;
    int maxPage;

    public DataSanitizer(List<Map<String, Object>> data) {
        this.data = data;
        orgDataLength = data.size();
    }

    final Set<String> getAllColumnNames(List<Measure> measures, List<Dimension> dimensions) {
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

    public final DataSanitizer groupBy(List<Measure> measures, List<Dimension> dimensions) {
        data = data.stream().collect(Collectors.groupingBy(map -> {
            StringBuilder sb = new StringBuilder();

            for (Dimension dimension : dimensions) {
                sb.append(String.valueOf(map.get(dimension.getName())));
            }

            return sb.toString();
        })).entrySet().stream()
                .map(e -> e.getValue().stream()
                        .reduce(new HashMap<String, Object>(), (acc, row) -> {
                            if (acc.keySet().size() == 0) {
                                acc = row;
                                
                                for (Measure measure : measures) {
                                    String name = measure.getName();
                                    Object value = row.get(name);
                                    measure.setSummaryName(measure.getSummaryType().toString() + "_" + name);
                                    // TODO: 추후 정렬 기준 항목 추가시 보수 필요
                                    if (value != null) {
                                        acc.put(measure.getSummaryName(), new SummaryCalculator(measure.getSummaryType(), value));
                                    }
                                    
                                }
                            } else {
                                for (Measure measure : measures) {
                                    String name = measure.getName();
                                    Object value = row.get(name);
                                    if (value != null) {
                                        if (acc.containsKey(name)) {
                                            SummaryCalculator sv = (SummaryCalculator)acc.get(measure.getSummaryName());
                                            acc.put(measure.getSummaryName(), sv.calculateSummaryValue(value));
                                        } else {
                                            acc.put(measure.getSummaryName(), new SummaryCalculator(measure.getSummaryType(), value));
                                        }
                                    }
                                }
                            }
                            return acc;
                        })).map((row) -> {
                            for (Measure measure : measures) {
                                String name = measure.getSummaryName();
                                if (row.get(name) instanceof SummaryCalculator) {
                                    SummaryCalculator sv = (SummaryCalculator)row.get(name);

                                    row.put(name, sv.getSummaryValue());
                                }
                            }
                            return row;
                        })
                        .collect(Collectors.toList());

        grpDataLenth = data.size();
        return this;
    }

    public final DataSanitizer columnFiltering(List<Measure> measures, List<Dimension> dimensions) {
        Set<String> columnNames = getAllColumnNames(measures, dimensions);

        data.forEach(map -> {
            map.keySet().retainAll(columnNames);
        });

        return this;
    }

    public final DataSanitizer orderBy(List<Dimension> dimensions) {
        // TODO: 추후 orderBy 적용해야 함. 현재는 이름순 정렬
        List<String> colNames = dimensions.stream()
                .map(Dimension::getName)
                .collect(Collectors.toList());

        Collections.sort(data, (o1, o2) -> {
            for (String col : colNames) {
                String value1 = String.valueOf(o1.get(col));
                String value2 = String.valueOf(o2.get(col));
                int compareResult = value1.compareTo(value2);
                if (compareResult != 0) {
                    return compareResult;
                }
            }

            return 0;
        });

        return this;
    }

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
}
