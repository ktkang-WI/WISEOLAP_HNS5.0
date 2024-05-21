package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;
import com.wise.MarketingPlatForm.report.domain.data.custom.DataPickUpMake;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.TopBottomInfo;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;

public class LiquidFillGaugeDataMakter implements ItemDataMaker  {
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
      List<String> dimNames = new ArrayList<>();
      List<Measure> seriesMeasureNames = new ArrayList<>();
      Map<String, Object> info = new HashMap<>();
      for (Dimension dim : dimensions) {
        dimNames.add(dim.getName());
      }
      for (Map<String, Object> row : data) {
          if (dimNames.size() == 0) {
              row.put("arg", "Grand Total");
          }

          if (dimNames.size() == 1) {
              row.put("arg", row.get(dimNames.get(0)));
          }

          if (dimNames.size() >= 2) {
              List<String> args = new ArrayList<>();
              for (String name : dimNames) {
                  args.add(String.valueOf(row.get(name)));
              }
              Collections.reverse(args);
              row.put("arg", String.join("<br/>", args));
          }
      }

      for (Measure measure : measures) {
        seriesMeasureNames.add(measure);
      }

      info.put("seriesMeasureNames", seriesMeasureNames);
      CommonResult result = new CommonResult(data, info);

    return result;
  }
  
}
