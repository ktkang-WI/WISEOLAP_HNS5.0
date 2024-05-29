package com.wise.MarketingPlatForm.report.domain.item.pivot.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.type.ItemType;

public class GridAttributeUtils {
  
  public GridAttributeUtils() {};

  public List<Measure> applyAttrMeasure(
    List<Measure> measures,
    ItemType itemType,
    Map<String, HashMap<String, Object>> gridAttribute
    ) {
    final boolean isUsedGridAttribute = gridAttribute.size() != 0;
    if (!isUsedGridAttribute) return measures;
    final List<Measure> result = measures.stream().filter((measure) -> {
      final String key = measure.getSummaryType() + "_" + measure.getName();
      if (!gridAttribute.containsKey(key)) return true;
      final HashMap<String, Object> option = gridAttribute.get(key);
      boolean isOk = true;
      if (itemType == ItemType.PIVOT_GRID) {
        isOk = Boolean.valueOf(option.get("gridVisibility").toString());
      }
      if (itemType == ItemType.CHART) {
        isOk = Boolean.valueOf(option.get("chartVisibility").toString());
      }
      return isOk;
    }).collect(Collectors.toList());
    return result;
  };
  public List<Dimension> applyAttrDimension(
    List<Dimension> dimensions,
    ItemType itemType,
    Map<String, HashMap<String, Object>> gridAttribute
    ) {
    final boolean isUsedGridAttribute = gridAttribute.size() != 0;
    if (!isUsedGridAttribute) return dimensions;
    final List<Dimension> result =  dimensions.stream().filter((dimension) -> {
      final String key = dimension.getName();
      if (!gridAttribute.containsKey(key)) return true;
      final HashMap<String, Object> option = gridAttribute.get(key);
      boolean isOk = true;
      if (itemType == ItemType.PIVOT_GRID) {
        isOk = Boolean.valueOf(option.get("gridVisibility").toString());
      }
      if (itemType == ItemType.CHART) {
        isOk = Boolean.valueOf(option.get("chartVisibility").toString());
      }
      return isOk;
    }).collect(Collectors.toList());
    return result;
  };

}
