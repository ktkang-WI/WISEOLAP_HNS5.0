package com.wise.MarketingPlatForm.report.domain.item.datamaker;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;
import com.wise.MarketingPlatForm.report.domain.data.custom.DataPickUpMake;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.TopBottomInfo;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;

public class TreeViewMaker implements ItemDataMaker {
  @Override
  public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> datas) {
    final List<Measure> temporaryMeasures = dataAggreagtion.getMeasures();
    final List<Measure> measures = dataAggreagtion.getOriginalMeasures();
    final List<Dimension> dimensions = dataAggreagtion.getDimensions();
    final List<Measure> sortByItems = dataAggreagtion.getSortByItems();
    final TopBottomInfo topBottomInfo = Objects.isNull(dataAggreagtion.getAdHocOption()) ? 
        null : dataAggreagtion.getAdHocOption().getTopBottomInfo();
    
    final DataSanitizer sanitizer = new DataSanitizer(datas, temporaryMeasures, dimensions, sortByItems);

    final List<Measure> allMeasure = new ArrayList<>();

    allMeasure.addAll(measures);
    allMeasure.addAll(sortByItems);

    // 데이터 기본 가공
    datas = sanitizer
            .dataFiltering(dataAggreagtion.getFilter())
            .groupBy()
            .replaceNullData()
            .topBottom(topBottomInfo)
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
    List<Map<String, Object>> treeDatas = new ArrayList<Map<String, Object>>();
    datas
      .stream()
      .forEach((d) -> {
        String id = "";
        String parentId = "";
        for (Dimension dimension : dimensions) {
          String value = d.get(dimension.getName()).toString();
          Map<String, Object> temp = new HashMap<>();
          parentId = id;
          id = id + value;
          temp.put("name", value);
          temp.put("ID", id);
          temp.put("parentId", parentId);
          temp.put("expanded", true);
          treeDatas.add(temp);
        }
      });
    datas = treeDatas;
    final Map<String, Object> info = new HashMap<String, Object>() {{
      put("seriesMeasureNames", measures);
    }};
    final CommonResult result = new CommonResult(datas, info);

    return result;
  }
}
