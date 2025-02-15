package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;
import com.wise.MarketingPlatForm.report.domain.data.custom.DataPickUpMake;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.TopBottomInfo;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;
import com.wise.MarketingPlatForm.utils.structures.tree.Tree;
import com.wise.MarketingPlatForm.utils.structures.tree.TreeList;
import com.wise.MarketingPlatForm.utils.structures.tree.TreeUtils;

public class CollapsibleTreeMaker implements ItemDataMaker{
  private final TreeUtils<Measure> treeUtils = new TreeUtils<>();

  @Override
  public ReportResult make(DataAggregation dataAggregation, List<Map<String, Object>> datas) {
    final List<Measure> temporaryMeasures = dataAggregation.getMeasures();
    final List<Measure> measures = dataAggregation.getOriginalMeasures();
    final List<Dimension> dimensions = dataAggregation.getDimensions();
    final List<Measure> sortByItems = dataAggregation.getSortByItems();
    boolean isCube = dataAggregation.getDataset().getDsType() == DsType.CUBE;

    DataSanitizer sanitizer = new DataSanitizer(datas, temporaryMeasures, dimensions, sortByItems, isCube);

    final List<Measure> allMeasure = new ArrayList<>();
    
        allMeasure.addAll(measures);
        allMeasure.addAll(sortByItems);

      // 데이터 기본 가공
      datas = sanitizer
              .dataFiltering(dataAggregation.getFilter())
              .groupBy()
              .replaceNullData()
              .topBottom()
              .orderBy()
              .columnFiltering()
              .getData();

    final DataPickUpMake customData = new DataPickUpMake(datas);
    final List<Map<String, Object>> tempData = customData.executer(dimensions, temporaryMeasures);
      if(tempData != null) {
          datas = tempData;
      }
    final List<String> dimNames = dimensions
        .stream()
        .map((dim) -> dim.getName())
        .collect(Collectors.toList());

      datas = datas.stream()
          .map((row) -> generateArg(dimNames, row))
          .collect(Collectors.toList());
    final String jsonData = execute(dimensions, measures, datas);
    final Map<String, Object> info = new HashMap<String, Object>() {{
        put("seriesMeasureNames", measures);
        put("jsonData", jsonData);
      }};
    
    final CommonResult result = new CommonResult(datas, info);
    return result;
  }
  private Map<String, Object> generateArg(List<String> dimNames, Map<String, Object> row) {
    if (dimNames.size() == 0) {
      row.put("arg", "Grand Total");
      return row;
    }

    final List<String> args = dimNames.stream()
                                      .map(name -> String.valueOf(row.get(name)))
                                      .collect(Collectors.toList());
    Collections.reverse(args);
    row.put("arg", String.join("<br/>", args));
    return row;
  }
  private String execute(
      List<Dimension> dimensions,
      List<Measure> measures,
      List<Map<String, Object>> datas) {
        Tree<BigDecimal> treeNode = new TreeList<>();

      for (Map<String, Object> data : datas) {
        String key = treeUtils.generateKey(data, dimensions);
        BigDecimal value =
          new BigDecimal(data.get(measures.get(0).getSummaryName()).toString());
        treeNode.push(key, value);
      }

    return treeNode.toString();
  }
}
