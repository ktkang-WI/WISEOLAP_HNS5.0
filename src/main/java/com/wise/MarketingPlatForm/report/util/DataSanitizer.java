package com.wise.MarketingPlatForm.report.util;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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
            columnNames.add(measure.getName());
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
    	        .reduce(new HashMap<String, Object>(), (acc, value) -> {
    	            if (acc.isEmpty()) {
    	                acc.putAll(value);
    	                for (Measure measure : measures) {
    	                    String name = measure.getName();
    	                    Object valueObj = value.get(name);
    	                    if (valueObj != null && !"".equals(name)) {
    	                        acc.put(name, new BigDecimal(String.valueOf(valueObj)));
    	                    }
    	                }
    	            } else {
    	                for (Measure measure : measures) {
    	                    String name = measure.getName();
    	                    Object valueObj = value.get(name);
    	                    if (valueObj != null && !"".equals(name)) {
    	                        BigDecimal target = new BigDecimal(String.valueOf(valueObj));
    	                        BigDecimal currentValue = (BigDecimal) acc.get(name);
    	                        if (currentValue == null) {
    	                            currentValue = BigDecimal.ZERO;
    	                        }
    	                        acc.put(name, currentValue.add(target));
    	                    }
    	                }
    	            }

    	            return acc;
    	        }))
    	    .collect(Collectors.toList());

        grpDataLenth = data.size();
        return this;
    }

    public final DataSanitizer columnFiltering(List<Measure> measures, List<Dimension> dimensions) {
        Set<String> columnNames = getAllColumnNames(measures, dimensions);

        data = data.stream()
                .map(v -> {
                    Map<String, Object> map = new HashMap<String, Object>();
                    Iterator<String> iterator = columnNames.iterator();

                    while (iterator.hasNext()) {
                        String key = iterator.next();
                        map.put(key, v.get(key));
                    }

                    return map;
                })
                .collect(Collectors.toList());

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
            List<Map<String, Object>> tempList = new ArrayList<>();

            int start = pagingOption.getStart();
            int size = pagingOption.getSize();
            int rows = Math.min(start + size, data.size());

            for (int i = start; i < rows; i++) {
                tempList.add(data.get(i));
            }

            maxPage = data.size() / pagingOption.getSize();

            if (data.size() % pagingOption.getSize() > 0) {
                maxPage += 1;
            }
            data = tempList;
        }

        return this;
    }
}
