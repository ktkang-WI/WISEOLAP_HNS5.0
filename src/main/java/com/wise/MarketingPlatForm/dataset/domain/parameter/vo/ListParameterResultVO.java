package com.wise.MarketingPlatForm.dataset.domain.parameter.vo;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ListParameterResultVO {
    List<String> value;
    List<Map<String, Object>> listItems;
}
