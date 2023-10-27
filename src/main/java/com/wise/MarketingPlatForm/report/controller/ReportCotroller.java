package com.wise.MarketingPlatForm.report.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
import com.wise.MarketingPlatForm.report.service.ReportService;
import com.wise.MarketingPlatForm.report.vo.DatasetVO;
import com.wise.MarketingPlatForm.report.vo.FieldVO;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.tags.Tag;


@Tag(name = "report", description = "report와 관련된 요청을 처리합니다.")
@RestController
@RequestMapping("/report")
public class ReportCotroller {

    private final ReportService reportService;
    
    ReportCotroller(ReportService reportService) {
        this.reportService = reportService;
    }

    @Operation(
        summary = "get report",
        description = "reportId로 보고서를 불러옵니다.")
    @Parameters({
        @Parameter(name = "reportId", description = "report id", example = "38454"),
        @Parameter(name = "userId", description = "user id", example = "admin", required = true),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        content = @Content(
	        examples = {
	            @ExampleObject(name = "example", value = "{\"reportId\": \"38454\", \"userId\": \"admin\"}")
	        }
        )
    )
    @PostMapping(value = "/getReport")
    public ReportMstrDTO getReport(@RequestBody Map<String, String> param) {
      Map<String, String> arguments = new HashMap<String, String>();
      arguments.put("reportId", param.getOrDefault("reportId", "5022"));
      arguments.put("userId", param.getOrDefault("userId", "admin"));
      return reportService.getReport(arguments);
  }   
}
