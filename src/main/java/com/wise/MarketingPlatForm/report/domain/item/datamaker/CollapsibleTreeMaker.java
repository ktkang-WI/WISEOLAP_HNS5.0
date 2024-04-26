package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.json.JSONObject;

import com.google.gson.JsonObject;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;
import com.wise.MarketingPlatForm.report.domain.data.custom.DataPickUpMake;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.TopBottomInfo;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;
import com.wise.MarketingPlatForm.utils.classfication.ClassficationManager;

public class CollapsibleTreeMaker implements ItemDataMaker{
  @Override
  public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data) {
    List<Measure> measures = dataAggreagtion.getMeasures();
    List<Dimension> dimensions = dataAggreagtion.getDimensions();
    List<Measure> sortByItems = dataAggreagtion.getSortByItems();
    TopBottomInfo topBottomInfo = Objects.isNull(dataAggreagtion.getAdHocOption()) ? 
      null : dataAggreagtion.getAdHocOption().getTopBottomInfo();
    
    DataSanitizer sanitizer = new DataSanitizer(data, measures, dimensions, sortByItems);

      List<Measure> allMeasure = new ArrayList<>();

      allMeasure.addAll(measures);
      allMeasure.addAll(sortByItems);

      // 데이터 기본 가공
      data = sanitizer
              .dataFiltering(dataAggreagtion.getFilter())
              .groupBy()
              .replaceNullData()
              .topBottom(topBottomInfo)
              .orderBy()
              .columnFiltering()
              .getData();

      DataPickUpMake customData = new DataPickUpMake(data);
      List<Map<String, Object>> tempData = customData.executer(dimensions, measures);
      if(tempData != null) {
          data = tempData;
      }

      // 차트 데이터 가공
      Map<String, Object> info = new HashMap<>();

      String resultData = execute(dimensions, measures, data);
      info.put("jsonData", resultData);
      CommonResult result = new CommonResult(data, "", info);

    return result;
  }
  private String execute(
      List<Dimension> dimensions,
      List<Measure> measures,
      List<Map<String, Object>> datas) {
        ClassficationManager classficationManager = new ClassficationManager();
        for (Map<String, Object> data : datas) {
          String key = "";
          Object value = data.get(measures.get(0).getName());
          for (Dimension dim : dimensions) {
            if (key.equals("")) key = data.get(dim.getName()).toString();
            else key = key + "-" + data.get(dim.getName());
          }
          classficationManager.push(key, value);
        }
    return classficationManager.toString();
  }

}
