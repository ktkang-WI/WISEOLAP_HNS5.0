package com.wise.MarketingPlatForm.report.domain.data.data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.wise.MarketingPlatForm.global.util.GroupingUtils;
import com.wise.MarketingPlatForm.report.domain.item.pivot.util.TopBottomUtils;

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
  // 적용항목의 depth가 > 0 일 경우의 topBottom 데이터 List
  private List<Map.Entry<String, List<Map<String, Object>>>> data;
  // 적용항목의 depth가 == 0 일 경우의 topBottom 데이터 List
  private List<Map<String, Object>> totalData;
  Measure measure;
  Dimension applyFieldDimension;
  // 적용항목 차원의 상위 차원까지의 List
  List<Dimension> dimensionList;
  private String dataFieldId;
  private String applyFieldId;
  private String topBottomType;
  private int topBottomCount;
  private boolean isPercent;
  private boolean isShowOthers;
  private int depth;

  /**
     * 측정값 List 에서 데이터항목(측정값/dataFieldId) 과 일치하는 측정값을 반환 합니다.
     * @return Measure
     */
  private Measure getMeasureByDataFieldId(List<Measure> measures) {
    return measures.stream().filter((measure) -> measure.getFieldId().equals(dataFieldId)).findFirst().orElse(null);
  };

  /**
     * 차원(행, 열) List 에서 적용항목(applyFieldId) 와 일치하는 차원의 상위 차원까지의
     * 차원 List 를 반환 합니다.
     * 예) 적용항목의 위치가 n 일 때,
     * 적용 항목이 행일 경우 n-1 번째 까지의 행 List 반환
     * 적용항목이 열일 경우, n-1 번째 까지의 열 List 반환
     * @return List<Dimension>
     */
  private List<Dimension> setGroupByDimensionList(List<Dimension> dimensions) {
    List<Dimension> dimList = new ArrayList<Dimension>();
    List<Dimension> list = new ArrayList<Dimension>();
    String applyCategory = null;

    for (Dimension dimension : dimensions) {
        String category = dimension.getCategory();
        if (applyFieldId.equals(dimension.getFieldId())) {
            applyCategory = category;
            applyFieldDimension = dimension;
        }
    }

    for (Dimension dimension : dimensions) {
        String category = dimension.getCategory();

        if (category.equals(applyCategory)) {
            dimList.add(dimension);
        }
    }

    list.add(dimList.get(0));
    for (int i = 1; i < dimList.size(); i++) {
        Dimension dimension = dimList.get(i);

        if (dimension.getFieldId().equals(applyFieldId)) {
            depth = i;
            break;
        }
        list.add(dimension);
    }

    return list;
  };

  /**
     * 조회시 데이터 항목으로 그룹화하여 측정값(Measure)을 집계한 데이터를 기준으로
     * 적용항목 차원의 상위 차원으로 그룹화하여 데이터항목(측정값)을 한번 더 집계 합니다.
     *
     * @return TopBottomInfo
     */
  private TopBottomInfo groupBy(List<Map<String, Object>> groupingData) {
    String name = measure.getSummaryName();

    if (depth > 0) {
        data = groupingData.stream()
        .collect(Collectors.groupingBy(GroupingUtils.groupingDimensionsMapper(dimensionList)))
        .entrySet().stream()
        .collect(Collectors.toList());
    } else {
        totalData = groupingData.stream()
        .collect(Collectors.groupingBy(GroupingUtils.groupingDimensionsMapper(dimensionList)))
        .entrySet().stream()
        .map(e -> TopBottomUtils.summarizeGroup(e.getValue(), name))
        .map((row) -> TopBottomUtils.convertSummaryCalculators(row, name))
        .collect(Collectors.toList());
    }

    return this;
  };

/**
 * Top/Bottom 을 적용 하기 위한 데이터 들을 정렬 합니다.
 * @return TopBottomInfo
 */
  private TopBottomInfo sort() {
    if (depth > 0) {
        for (Map.Entry<String, List<Map<String, Object>>> map : data) {
            List<Map<String, Object>> valueList = map.getValue();

            TopBottomUtils.sortList(valueList, measure.getSummaryName());
        }
    } else {
        TopBottomUtils.sortList(totalData, measure.getSummaryName());
    }

    return this;
  }

  /**
 * Top/Bottom 을 적용 하기 위해 정렬된 데이터를 TopBottomCount 에 따라 자릅니다.
 * @return TopBottomInfo
 */
  private TopBottomInfo split() {
    /**
    * percent 적용 체크 박스의 유무에 따라 전체 데이터 길이의 %를 적용해줍니다.
    */
    TopBottomUtils.adjustTopBottomCount(this);

    if (depth > 0) {
        for (Map.Entry<String, List<Map<String, Object>>> map : data) {
            List<Map<String, Object>> valueList = map.getValue();
            int count = Math.min(valueList.size(), topBottomCount);

            List<Map<String, Object>> selectedData = TopBottomUtils.splitData(valueList, this);
            List<Map<String, Object>> othersData = topBottomType.equals("TOP") ?
            valueList.stream().limit(valueList.size() - count).collect(Collectors.toList()) :
            valueList.stream().skip(count).collect(Collectors.toList());

            if (isShowOthers) {
                Map<String, Object> otherMap = TopBottomUtils.summarizeOthersGroup(othersData, this);
                selectedData.add(otherMap);
            }

            map.setValue(selectedData);
        }
    } else {
        totalData = TopBottomUtils.splitData(totalData, this);
    }

    return this;
  }

  /**
 * 조회된 데이터 를 topBottom 을 적용한 데이터 와 비교 하여 일치하는 데이터를 필터링 합니다.
 * TODO: refactoring 필요
 * @return List<Map<String, Object>>
 */
  private List<Map<String, Object>> filter(List<Map<String, Object>> groupingData, List<Dimension> dimensions) {
    if (depth > 0) {
        groupingData = groupingData.stream().filter((row) -> {
            List<Map<String, Object>> valueList = new ArrayList<Map<String, Object>>();
                data.stream()
                .forEach(e -> e.getValue()
                    .stream()
                    .forEach((value) -> {
                        Map<String, Object> newValue = new HashMap<String, Object>();
                        for (int i=0; i<dimensions.size(); i++) {
                            String dimName = dimensions.get(i).getName();
                            String dimFieldId = dimensions.get(i).getFieldId();
                            if (value.get(dimName) != null) {
                                newValue.put(dimName, value.get(dimName));
                            }

                            if (dimFieldId.equals(applyFieldId)) {
                                break;
                            }
                        }
                        if (newValue.values().size() > 0) {
                            valueList.add(newValue);
                        }
                    })
                );

            boolean check = false;
            for (Map<String, Object> value : valueList) {
                check = false;
                for (Dimension dim : dimensions) {
                    String dimensionName = dim.getName();
                    String dimFieldId = dim.getFieldId();
                    if (value.get(dimensionName).equals(row.get(dimensionName))) {
                        check = true;
                    }else {
                        check = false;
                        break;
                    }
                    if (dimFieldId.equals(applyFieldId)) {
                        break;
                    }
                }
                if (check) break;
            }

            return check;
        })
        .collect(Collectors.toList());
    } else {
        String dimensionName = applyFieldDimension.getName();

        List<String> applyNames = totalData.stream()
        .map(row -> (String) row.get(dimensionName))
        .collect(Collectors.toList());

        Map<String, Object> otherMap = null;
        if (isShowOthers) {
          List<Map<String, Object>>  othersData = groupingData.stream()
            .filter(row -> !applyNames.contains(row.get(dimensionName)))
            .collect(Collectors.toList());
            otherMap = TopBottomUtils.summarizeOthersGroup(othersData, this);
        }

        groupingData = groupingData.stream()
        .filter(row -> applyNames.contains(row.get(dimensionName)))
        .collect(Collectors.toList());

        if (isShowOthers) {
            groupingData.add(otherMap);
        }
    }

    return groupingData;
  }

  public List<Map<String, Object>> getTopBottomData(List<Map<String, Object>> groupingData, List<Measure> measures, List<Dimension>dimensions) {
    // topBottom 데이터 항목
    this.measure = getMeasureByDataFieldId(measures);
    this.dimensionList = setGroupByDimensionList(dimensions);

    return groupBy(groupingData)
    .sort()
    .split()
    .filter(groupingData, dimensions);
  }
}
