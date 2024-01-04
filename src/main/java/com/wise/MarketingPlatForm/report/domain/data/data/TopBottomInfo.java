package com.wise.MarketingPlatForm.report.domain.data.data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import com.wise.MarketingPlatForm.global.util.StringCompareUtils;
import com.wise.MarketingPlatForm.report.domain.data.SummaryCalculator;
import com.wise.MarketingPlatForm.report.type.SummaryType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopBottomInfo {
  private String dataFieldId;
  private String applyFieldId;
  private String topBottomType;
  private int topBottomCount;
  private boolean isPercent;
  private boolean isShowOthers;

  private Measure getMeasureByDataFieldId(List<Measure> measures) {
    dataFieldId = "dataItem0";
    return measures.stream().filter((measure) -> measure.getFieldId().equals(dataFieldId)).findFirst().orElse(null);
  };

  private List<Dimension> getDimensionByApplyFieldId(List<Dimension> dimensions) {
    applyFieldId = "dataItem1";
    // applyFieldId = "dataItem2";

    int index = 0;
    List<Dimension> list = new ArrayList<Dimension>();

    for (int i=0; i<dimensions.size(); i++) {
      if (dimensions.get(i).getFieldId().equals(applyFieldId)) {
        index = i;
        break;
      }
    }

    for (int i=0; i<=index; i++) {
      list.add(dimensions.get(i));
    }

    return list;
  };

  public List<Map<String, Object>> getTopBottomData(List<Map<String, Object>> groupingData, List<Measure> measures, List<Dimension>dimensions) {
    List<Map<String, Object>> tomBottomData = null;
    // topBottom 데이터 항목
    Measure measure = getMeasureByDataFieldId(measures);
    // topBottom 적용 항목
    List<Dimension> dimensionList = getDimensionByApplyFieldId(dimensions);
    // topBottom 구분
    // String topBottomType = topBottomInfo.getTopBottomType();
    String topBottomType = "TOP";
    // topBottom 개수
    // int topBottomCount = data.size() - topBottomInfo.getTopBottomCount();
    int topBottomCount = 3;
    // topBottom % 적용 여부
    // boolean topBottomIsPercent = topBottomInfo.isPercent();
    boolean topBottomIsPercent = false;
    // topBottom 기타 표시 여부
    // topBottomInfo.isShowOthers();

    String name = measure.getSummaryName();
    // String name = "SUM_SUM(금액)";

    // 적용 항목으로 group by
    tomBottomData = groupingData.stream().collect(Collectors.groupingBy(map -> {
        StringBuilder sb = new StringBuilder();

        for (Dimension dimension : dimensionList) {
            sb.append(String.valueOf(map.get(dimension.getName())));
            sb.append("-wise-split-");
        }

        return sb.toString();
    })).entrySet().stream()
    .map(e -> e.getValue().stream()
        .reduce(new HashMap<String, Object>(), (acc, row) -> {
            if (acc.keySet().size() == 0) {
                acc = row;
            } else {
                Object value = row.get(name);

                SummaryCalculator sv = new SummaryCalculator(SummaryType.SUM, acc.get(name));
                acc.put(name, sv.calculateSummaryValue(value));
            }
            return acc;
        }))
    .map((row) -> {
            if (row.get(name) instanceof SummaryCalculator) {
                SummaryCalculator sv = (SummaryCalculator) row.get(name);

                row.put(name, sv.getSummaryValue());
            }
            return row;
        })
    .collect(Collectors.toList());

    // 정렬
    Collections.sort(tomBottomData, (o1, o2) -> {
        // int weight = sort.getSortOrder().equals("ASC") ? 1 : -1;
        // int weight = topBottomType.equals("TOP") ? 1 : -1;
        for (int i=0; i<dimensionList.size(); i++) {
            String sortBy = i != dimensionList.size() - 1 ?
            dimensionList.get(i).getName() :
            name;
            int weight = 1;
            Object v1 = o1.get(sortBy);
            Object v2 = o2.get(sortBy);

            int compareResult = 0;

            if (v1 instanceof String) {
                compareResult = StringCompareUtils.compare((String) v1, (String) v2);
            } else {
                compareResult = ((BigDecimal) v1).compareTo((BigDecimal) v2);
            }

            if (compareResult != 0) {
                return compareResult * weight;
            }
        }

        return 0;
    });

    // TOP/BOTTOM 자르기
    // top 일 땐, limit
    // bottom 일 땐, skip
    if (topBottomIsPercent) {
        double percent = topBottomCount * 0.01 * tomBottomData.size();

        if (percent < 1) {
            topBottomCount = (int)Math.ceil(percent);
        } else {
            topBottomCount = (int) Math.round(percent);
        }
    }

    if (topBottomType.equals("TOP")) {
        tomBottomData = tomBottomData.stream().skip(tomBottomData.size() - topBottomCount)
        .collect(Collectors.toList());
    } else {
        tomBottomData = tomBottomData.stream().limit(topBottomCount)
        .collect(Collectors.toList());
    }

    //기존 groupingData 에서 topBottomData의 key 값과 일치하는 data filtering
    // groupingData.stream().map(e -> e.getKey());
    int size = dimensionList.size();
    String dimensionName = dimensionList.get(size-1).getName();

    List<String> applyNames = tomBottomData.stream()
    .map(row -> (String) row.get(dimensionName))
    .collect(Collectors.toList());

    return groupingData.stream().filter((row) -> applyNames.contains(row.get(dimensionName)))
    .collect(Collectors.toList());
  }
}
