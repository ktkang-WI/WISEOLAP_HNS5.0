package com.wise.MarketingPlatForm.report.domain.data.data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
  private List<Map.Entry<String, List<Map<String, Object>>>> data;
  private List<Map<String, Object>> totalData;
  Measure measure;
  Dimension applyFieldDimension;
  List<Dimension> dimensionList;
  private String dataFieldId;
  private String applyFieldId;
  private String topBottomType;
  private int topBottomCount;
  private boolean isPercent;
  private boolean isShowOthers;
  private int depth;

  private Measure getMeasureByDataFieldId(List<Measure> measures) {
    return measures.stream().filter((measure) -> measure.getFieldId().equals(dataFieldId)).findFirst().orElse(null);
  };

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

  private TopBottomInfo groupBy(List<Map<String, Object>> groupingData) {
    if (depth > 0) {
        data = groupingData.stream().collect(Collectors.groupingBy(map -> {
            StringBuilder sb = new StringBuilder();

            for (Dimension dimension : dimensionList) {
                sb.append(String.valueOf(map.get(dimension.getName())));
                sb.append("-wise-split-");
            }

            return sb.toString();
        })).entrySet().stream()
        .collect(Collectors.toList());
    } else {
        String name = measure.getSummaryName();
        totalData = groupingData.stream().collect(Collectors.groupingBy(map -> {
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
                    acc.put(name, sv.calculateSummaryValue(value).getSummaryValue());
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
        // totalData = groupingData;
    }

    return this;
  };

  private TopBottomInfo sort() {
    if (depth > 0) {
        String sortBy = measure.getSummaryName();

        for (Map.Entry<String, List<Map<String, Object>>> map : data) {
            List<Map<String, Object>> valueList = map.getValue();

            Collections.sort(valueList, (o1, o2) -> {
                Object v1 = o1.get(sortBy);
                Object v2 = o2.get(sortBy);

                int compareResult = 0;

                if (v1 instanceof String) {
                    compareResult = StringCompareUtils.compare((String) v1, (String) v2);
                } else {
                    compareResult = ((BigDecimal) v1).compareTo((BigDecimal) v2);
                }

                if (compareResult != 0) {
                    return compareResult;
                }

                return 0;
            });
        }
    } else {
        Collections.sort(totalData, (o1, o2) -> {
            for (int i=0; i<dimensionList.size(); i++) {
                String sortBy = measure.getSummaryName();

                Object v1 = o1.get(sortBy);
                Object v2 = o2.get(sortBy);

                int compareResult = 0;

                if (v1 instanceof String) {
                    compareResult = StringCompareUtils.compare((String) v1, (String) v2);
                } else {
                    compareResult = ((BigDecimal) v1).compareTo((BigDecimal) v2);
                }

                if (compareResult != 0) {
                    return compareResult;
                }
            }

            return 0;
        });
    }

    return this;
  }

  private TopBottomInfo split() {

    if (isPercent) {
        double percent = depth > 0 ? topBottomCount * 0.01 * data.size() :
        topBottomCount * 0.01 * totalData.size();

        if (percent < 1) {
            topBottomCount = (int)Math.ceil(percent);
        } else {
            topBottomCount = (int) Math.round(percent);
        }
    }

    if (depth > 0) {
        for (Map.Entry<String, List<Map<String, Object>>> map : data) {
            List<Map<String, Object>> valueList = map.getValue();
            List<Map<String, Object>> othersData = new ArrayList<Map<String, Object>>();

            int count = valueList.size() < topBottomCount ? valueList.size() : topBottomCount;
            if (topBottomType.equals("TOP")) {
                if (isShowOthers) {
                    othersData = valueList.stream().limit(valueList.size() - count)
                .collect(Collectors.toList());
                }
                valueList = valueList.stream().skip(valueList.size() - count)
                .collect(Collectors.toList());
            } else {
                if (isShowOthers) {
                    othersData = valueList.stream().skip(count)
                .collect(Collectors.toList());
                }
                valueList = valueList.stream().limit(count)
                .collect(Collectors.toList());
            };

            if (isShowOthers) {
                Map<String, Object> otherMap = othersData.stream()
                    .reduce(new HashMap<String, Object>(), (acc, row) -> {
                        if (acc.keySet().size() == 0) {
                            acc = row;
                            acc.put(applyFieldDimension.getName(), "기타");
                        } else {
                            String summaryName = measure.getSummaryName().toString();
                            SummaryCalculator sv = new SummaryCalculator(measure.getSummaryType(), acc.get(summaryName));
                            Object value = row.get(measure.getSummaryName());
                            acc.put(measure.getSummaryName(), sv.calculateSummaryValue(value).getSummaryValue());
                        }
                        return acc;
                    });
                valueList.add(otherMap);
            }

            map.setValue(valueList);
        }
    } else {
        int count = totalData.size() < topBottomCount ? totalData.size() : topBottomCount;
        if (topBottomType.equals("TOP")) {
            totalData = totalData.stream().skip(totalData.size() - count)
            .collect(Collectors.toList());
        } else {
            totalData = totalData.stream().limit(count)
            .collect(Collectors.toList());
        }
    }

    return this;
  }

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
          List<Map<String, Object>>  othersData = groupingData.stream().filter(row -> !applyNames.contains(row.get(dimensionName)))
            .collect(Collectors.toList());
            otherMap = othersData.stream().reduce(new HashMap<String, Object>(), (acc, row) -> {
                if (acc.keySet().size() == 0) {
                    // acc = row;
                    acc.put(dimensionName, "기타");
                    acc.put(measure.getSummaryName(), row.get(measure.getSummaryName()));
                } else {
                    String summaryName = measure.getSummaryName().toString();
                    SummaryCalculator sv = new SummaryCalculator(measure.getSummaryType(), acc.get(summaryName));
                    Object value = row.get(measure.getSummaryName());
                    acc.put(measure.getSummaryName(), sv.calculateSummaryValue(value).getSummaryValue());
                }
                return acc;
            });
        }

        groupingData = groupingData.stream().filter(row -> applyNames.contains(row.get(dimensionName)))
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
