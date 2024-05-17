package com.wise.MarketingPlatForm.global.util;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;

public class GroupingUtils {
  public static Function<Map<String, Object>, String> groupingDimensionsMapper(List<Dimension> dimensions) {
    return map -> {
        StringBuilder sb = new StringBuilder();

        for (Dimension dimension : dimensions) {
            sb.append(String.valueOf(map.get(dimension.getName())));
            sb.append("-wise-split-");
        }

        return sb.toString();
    };
  }
}
