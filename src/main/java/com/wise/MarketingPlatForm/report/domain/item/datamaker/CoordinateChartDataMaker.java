package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;
import com.wise.MarketingPlatForm.report.domain.data.custom.DataPickUpMake;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;

public class CoordinateChartDataMaker implements ItemDataMaker {
  
  @Override
  public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data) {
    List<Measure> temporaryMeasures = dataAggreagtion.getMeasures();
    List<Measure> measures = dataAggreagtion.getOriginalMeasures();
    List<Dimension> dimensions = dataAggreagtion.getDimensions();
    List<Measure> sortByItems = dataAggreagtion.getSortByItems();
    
    DataSanitizer sanitizer = new DataSanitizer(data, temporaryMeasures, dimensions, sortByItems);

    // 데이터 기본 가공
    data = sanitizer
            .dataFiltering(dataAggreagtion.getFilter())
            .temporaryColumnsAdd()
            .replaceNullData()
            .orderBy()
            .columnFiltering()
            .getData();

    DataPickUpMake customData = new DataPickUpMake(data);
    List<Map<String, Object>> tempData = customData.executer(dimensions, temporaryMeasures);
    if(tempData != null) {
        data = tempData;
    }

    Set<String> dimNames = new HashSet<>();

    StringBuilder sb = new StringBuilder();

    String yName = "";
    String xName = "";

    for (Measure measure : measures) {
        if (measure.getCategory().equals("x")) {
            xName = measure.getName();
        }
        if (measure.getCategory().equals("y")) {
            yName = measure.getName();
        }
    }

    BigDecimal yRange = new BigDecimal(0);
    BigDecimal xRange = new BigDecimal(0);
    for (Map<String, Object> row : data) {
        sb.setLength(0);

        for (Dimension dimension : dimensions) {
            sb.append(row.get(dimension.getName())).append("-");
        }

        yRange = yRange.max(new BigDecimal(row.get(yName).toString()).abs());
        xRange = xRange.max(new BigDecimal(row.get(xName).toString()).abs());
        String name = sb.substring(0, sb.length() - 1);
        dimNames.add(name);
        row.put("arg", name);
    }

    Map<String, Object> info = new HashMap<>();

    info.put("args", dimNames);
    info.put("xRange", xRange);
    info.put("yRange", yRange);
    info.put("x", xName);
    info.put("y", yName);
    CommonResult result = new CommonResult(data, "", info);

    return result;
  }
}
