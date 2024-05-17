package com.wise.MarketingPlatForm.dataset.domain.parameter.vo;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ListParameterDTO {
    @Getter
    @Setter
    public class LinkageValue {
        String name;
        String operation;
        List<String> value;
        String exceptionValue;
    }

    String dataSource;
    String dataSourceType;
    String dataType;
    List<String> defaultValue;
    boolean defaultValueUseSql;
    int dsId;
    String itemCaption;
    String itemKey;
    List<LinkageValue> linkageValues;
    String operation;
    String sortBy;
    String sortOrder;
    boolean useAll;
    boolean multiSelect;

    public static ListParameterDTO fromMap(Map<String, String> map) {
        Gson gson = new Gson();

        List<String> defaultValue = gson.fromJson(String.valueOf(map.get("defaultValue")),
            new TypeToken<ArrayList<String>>() {
            }.getType());
        List<LinkageValue> linkageValues = gson.fromJson(String.valueOf(map.getOrDefault("linkageValues", "[]")),
            new TypeToken<ArrayList<LinkageValue>>() {
            }.getType());
        return ListParameterDTO.builder()
        .dsId(Integer.parseInt(map.get("dsId")))
        .dataSource(String.valueOf(map.get("dataSource")))
        .dataSourceType(String.valueOf(map.get("dataSourceType")))
        .dataType(String.valueOf(map.get("dataType")))
        .defaultValue(defaultValue)
        .linkageValues(linkageValues)
        .defaultValueUseSql(Boolean.valueOf(map.get("defaultValueUseSql")))
        .itemCaption(String.valueOf(map.get("itemCaption")))
        .itemKey(String.valueOf(map.get("itemKey")))
        .operation(String.valueOf(map.get("operation")))
        .sortBy(String.valueOf(map.getOrDefault("sortBy", "")))
        .sortOrder(String.valueOf(map.getOrDefault("sortOrder", "")))
        .useAll(Boolean.valueOf(String.valueOf(map.get("useAll"))))
        .multiSelect(Boolean.valueOf(String.valueOf(map.get("multiSelect"))))
        .build();
    }
}
