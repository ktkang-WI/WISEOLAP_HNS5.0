package com.wise.MarketingPlatForm.dataset.domain.parameter.vo.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.poi.util.StringUtil;

import com.wise.MarketingPlatForm.dataset.domain.parameter.vo.ListParameterDTO;
import com.wise.MarketingPlatForm.dataset.domain.parameter.vo.ListParameterDTO.LinkageValue;
import com.wise.MarketingPlatForm.report.domain.data.data.Parameter;
import com.wise.MarketingPlatForm.report.domain.store.datastore.SqlQueryGenerator;

public final class ListParameterUtils {
    public final static String applyLinkageFilterAtQuery(String query, ListParameterDTO listParameterDTO) {
        SqlQueryGenerator queryGenerator = new SqlQueryGenerator();
        List<Parameter> params = new ArrayList<Parameter>();
        for (LinkageValue value : listParameterDTO.getLinkageValues()) {
            Parameter param = new Parameter(0, value.getName(), null, value.getOperation(), null, value.getExceptionValue(), value.getValue());
            params.add(param);
        }

        query = queryGenerator.applyParameter(params, query);
        return query;
    }

    public final static List<Map<String, Object>> sanitize(List<Map<String, Object>> data,
            ListParameterDTO listParameterDTO) {

        if (StringUtil.isNotBlank(listParameterDTO.getSortBy())) {
            int weight = listParameterDTO.getSortOrder().equals("ASC") ? 1 : -1;
            Collections.sort(data, (o1, o2) -> {
                String value1 = String.valueOf(o1.get(listParameterDTO.getSortBy()));
                String value2 = String.valueOf(o2.get(listParameterDTO.getSortBy()));

                return value1.compareTo(value2) * weight;
            });
        }

        data = data.stream()
                .map(v -> {
                    Map<String, Object> map = new HashMap<String, Object>();

                    map.put("name", v.get(listParameterDTO.getItemKey()));
                    map.put("caption", v.get(listParameterDTO.getItemCaption()));

                    return map;
                })
                .collect(Collectors.toList());
        return data;
    }
}
