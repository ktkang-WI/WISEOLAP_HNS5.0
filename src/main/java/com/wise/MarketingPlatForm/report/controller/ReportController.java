package com.wise.MarketingPlatForm.report.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Dataset;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.PagingOption;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.service.ReportService;
import com.wise.MarketingPlatForm.report.type.ItemType;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "report", description = "보고서와 관련된 요청을 처리합니다.")
@RestController
@RequestMapping("/report")
public class ReportController {
  private final ReportService reportService;
  
  ReportController(ReportService reportService) {
    this.reportService = reportService;
  }

  @Operation(
    summary = "item-data",
    description = "아이템의 데이터를 조회합니다.")
  @Parameters({
    @Parameter(name = "dimensions", description = "차원 데이터 항목 목록"),
    @Parameter(name = "measures", description = "측정값 데이터 항목 목록"),
  })
  @io.swagger.v3.oas.annotations.parameters.RequestBody(
    content = @Content(
      examples = {
        @ExampleObject(name = "example", value = "{\"cubeId\": \"5181\", \"userId\": \"admin\"}")
      }
    )
  )
  @PostMapping(value = "/item-data")
  public ReportResult getCube(@RequestBody Map<String, String> param) {
    Gson gson = new Gson();
    String dimensionsStr = param.getOrDefault("dimension", "");
    String measuresStr = param.getOrDefault("measure", "");
    String datasetStr = param.getOrDefault("dataset", "");
    String ItemTypeStr = param.getOrDefault("itemType", "");
    String userId = param.getOrDefault("userId", "");
    String pagingOptionStr = param.getOrDefault("pagingOption", "");

    List<Dimension> dimensions = gson.fromJson(dimensionsStr,
        new TypeToken<ArrayList<Dimension>>(){}.getType());
    List<Measure> measures = gson.fromJson(measuresStr,
        new TypeToken<ArrayList<Measure>>(){}.getType());
    Dataset dataset = gson.fromJson(datasetStr, Dataset.class);
    PagingOption pagingOption = gson.fromJson(pagingOptionStr, PagingOption.class);
    ItemType itemType = ItemType.fromString(ItemTypeStr).get();

    DataAggregation dataAggreagtion =
        DataAggregation.builder()
          .dataset(dataset)
          .measures(measures)
          .dimensions(dimensions)
          .itemType(itemType)
          .userId(userId)
          .pagingOption(pagingOption)
          .build();

    return reportService.getItemData(dataAggreagtion);
  }


}
