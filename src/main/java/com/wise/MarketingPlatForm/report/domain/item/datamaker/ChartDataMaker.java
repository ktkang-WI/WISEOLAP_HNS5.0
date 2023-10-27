package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.Map;
import java.util.Set;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;
import com.wise.MarketingPlatForm.report.util.DataSanitizer;

public class ChartDataMaker implements ItemDataMaker {
  @Override
  public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data) {
    List<Measure> measures = dataAggreagtion.getMeasures();
    List<Dimension> dimensions = dataAggreagtion.getDimensions();
    DataSanitizer sanitizer = new DataSanitizer(data);

    // 데이터 기본 가공
    data = sanitizer
        .groupBy(measures, dimensions)
        .columnFiltering(measures, dimensions)
        .orderBy(dimensions)
        .getData();

    // 차트 데이터 가공
    List<String> dimNames = new ArrayList<>();
    List<String> dimGrpNames = new ArrayList<>();
    Set<String> dimensionGroupNames = new LinkedHashSet<>();
    Set<String> seriesDimensionNames = new LinkedHashSet<>();
    Set<String> seriesDimensionCaptions = new LinkedHashSet<>();
    Map<String, Object> info = new HashMap<>();

    for (Dimension dim : dimensions) {
      if ("dimension".equals(dim.getCategory())) {
        dimNames.add(dim.getName());
      } else {
        dimGrpNames.add(dim.getName());
      }
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
        row.put("arg", String.join("<br/>", args));
      }

      if (dimGrpNames.size() > 0) {
        List<String> args = new ArrayList<>();
        for (String name : dimGrpNames) {
          args.add(String.valueOf(row.get(name)));
        }

        String argStr = String.join("-", args);
        dimensionGroupNames.add(argStr);

        for (Measure measure : measures) {
          StringBuilder sb = new StringBuilder(argStr);
          sb.append("-");
          sb.append(measure.getName());

          row.put(sb.toString(), row.get(measure.getName()));
          row.remove(measure.getName());
        }
      } else {
        for (Measure measure : measures) {
          seriesDimensionNames.add(measure.getName());
          seriesDimensionCaptions.add(measure.getCaption());
        }
      }
    }

    if (dimGrpNames.size() > 0) {
      for (Measure measure : measures) {
        Iterator<String> iter = dimensionGroupNames.iterator();

        while (iter.hasNext()) {
          String name = iter.next();
          seriesDimensionNames.add(name + "-" + measure.getName());
          seriesDimensionCaptions.add(name + "-" + measure.getCaption());
        }
      }
      if (measures.size() == 1) {
        seriesDimensionCaptions = dimensionGroupNames;
      } 
    }

    info.put("seriesDimensionNames", seriesDimensionNames);
    info.put("seriesDimensionCaptions", seriesDimensionCaptions);

    CommonResult result = new CommonResult(data, "", info);

    return result;
  }
}
