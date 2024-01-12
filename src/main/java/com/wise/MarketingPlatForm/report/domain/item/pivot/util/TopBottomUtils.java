package com.wise.MarketingPlatForm.report.domain.item.pivot.util;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.wise.MarketingPlatForm.global.util.StringCompareUtils;

import com.wise.MarketingPlatForm.report.domain.data.SummaryCalculator;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.TopBottomInfo;
import com.wise.MarketingPlatForm.report.type.SummaryType;

public class TopBottomUtils {
  public static Map<String, Object> summarizeGroup(List<Map<String, Object>> group, String name) {
    return group.stream()
            .reduce(new HashMap<>(), (acc, row) -> {
                if (acc.isEmpty()) {
                    acc.putAll(row);
                } else {
                    Object value = row.get(name);
                    SummaryCalculator sv = new SummaryCalculator(SummaryType.SUM, acc.get(name));
                    acc.put(name, sv.calculateSummaryValue(value).getSummaryValue());
                }
                return acc;
            });
  }

  public static Map<String, Object> summarizeOthersGroup(List<Map<String, Object>> group, TopBottomInfo topBottomInfo) {
    Measure measure = topBottomInfo.getMeasure();
    return group.stream()
        .reduce(new HashMap<String, Object>(), (acc, row) -> {
          if (acc.keySet().size() == 0) {
              acc = row;
              acc.put(topBottomInfo.getApplyFieldDimension().getName(), "기타");
          } else {
              String summaryName = measure.getSummaryName().toString();
              SummaryCalculator sv = new SummaryCalculator(measure.getSummaryType(), acc.get(summaryName));
              Object value = row.get(measure.getSummaryName());
              acc.put(measure.getSummaryName(), sv.calculateSummaryValue(value).getSummaryValue());
          }
          return acc;
      });
  }

  public static Map<String, Object> convertSummaryCalculators(Map<String, Object> row, String name) {
      if (row.get(name) instanceof SummaryCalculator) {
          SummaryCalculator sv = (SummaryCalculator) row.get(name);
          row.put(name, sv.getSummaryValue());
      }
      return row;
  }

  public static void sortList(List<Map<String, Object>> list, String sortBy) {
    Collections.sort(list, (o1, o2) -> {
        return ((BigDecimal)o1.get(sortBy)).compareTo((BigDecimal)o2.get(sortBy));
    });
  }

  public static void adjustTopBottomCount(TopBottomInfo topBottomInfo) {
      if (topBottomInfo.isPercent()) {
          double percent = topBottomInfo.getDepth() > 0 ? topBottomInfo.getTopBottomCount() * 0.01 * topBottomInfo.getData().size() :
                                      topBottomInfo.getTopBottomCount() * 0.01 * topBottomInfo.getTotalData().size();
          int topBottomCount = (int) Math.round(Math.max(1, percent));
          topBottomInfo.setTopBottomCount(topBottomCount);
      }
  }

  public static List<Map<String, Object>> splitData(List<Map<String, Object>> data, TopBottomInfo topBottomInfo) {
    int count = Math.min(data.size(), topBottomInfo.getTopBottomCount());
    return topBottomInfo.getTopBottomType().equals("TOP") ?
           data.stream().skip(data.size() - count).collect(Collectors.toList()) :
           data.stream().limit(count).collect(Collectors.toList());
  }

}
