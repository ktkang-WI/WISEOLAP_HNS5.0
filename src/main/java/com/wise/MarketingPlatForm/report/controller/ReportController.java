package com.wise.MarketingPlatForm.report.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Dataset;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.PagingOption;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.service.ReportService;
import com.wise.MarketingPlatForm.report.type.EditMode;
import com.wise.MarketingPlatForm.report.type.ItemType;
import com.wise.MarketingPlatForm.report.type.ReportType;
import com.wise.MarketingPlatForm.report.vo.ReportListDTO;
import com.wise.MarketingPlatForm.report.vo.FolderMasterVO;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;
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
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    private final ReportService reportService;

    @Autowired
    private ObjectMapper objectMapper;

    ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @Operation(summary = "item-data", description = "아이템의 데이터를 조회합니다.")
    @Parameters({
            @Parameter(name = "dataset", description = "데이터 집합 정보"),
            @Parameter(name = "dimensions", description = "차원 데이터 항목 목록"),
            @Parameter(name = "measures", description = "측정값 데이터 항목 목록"),
            @Parameter(name = "userId", description = "현재 접속한 유저의 아이디"),
            @Parameter(name = "itemType", description = "아이템 타입"),
            @Parameter(name = "pagingOption", description = "적용할 페이징 옵션"),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\r\n" + //
                    "    \"dataset\": \"{ \\\"dsId\\\": 2144, \\\"dsType\\\": \\\"DS_SQL\\\", \\\"query\\\": \\\"SELECT  Sum([F_자동차_작업일지].[금액]) AS [금액],\\n"
                    + //
                    "        Sum([F_자동차_작업일지].[부가세]) AS [부가세],\\n" + //
                    "        Sum([F_자동차_작업일지].[소계]) AS [소계],\\n" + //
                    "        D_생산회사.[생산회사코드] AS [생산회사코드],\\n" + //
                    "        D_생산회사.[생산회사이름] AS [생산회사이름],\\n" + //
                    "        D_자동차종류.[자동차코드] AS [자동차코드],\\n" + //
                    "        D_자동차종류.[자동차명] AS [자동차명],\\n" + //
                    "        D_결재구분.[결재코드] AS [결재코드],\\n" + //
                    "        D_결재구분.[결재구분명] AS [결재구분명] \\n" + //
                    "FROM    F_자동차_작업일지  INNER JOIN D_자동차종류 D_자동차종류 ON F_자동차_작업일지.[자동차] = D_자동차종류.[자동차코드]\\n" + //
                    "        INNER JOIN D_생산회사 D_생산회사 ON D_자동차종류.[생산회사코드] = D_생산회사.[생산회사코드]\\n" + //
                    "        INNER JOIN D_결재구분 D_결재구분 ON F_자동차_작업일지.[결재구분] = D_결재구분.[결재코드]\\n" + //
                    "        \\n" + //
                    "WHERE   (1=1)\\n" + //
                    "\\t\\n" + //
                    "GROUP BY\\tD_생산회사.[생산회사코드],\\n" + //
                    "\\t\\tD_생산회사.[생산회사이름],\\n" + //
                    "\\t\\tD_자동차종류.[자동차코드],\\n" + //
                    "\\t\\tD_자동차종류.[자동차명],\\n" + //
                    "\\t\\tD_결재구분.[결재코드],\\n" + //
                    "\\t\\tD_결재구분.[결재구분명]\\\"}\",\r\n" + //
                    "    \"userId\": \"admin\",\r\n" + //
                    "    \"itemType\": \"grid\",\r\n" + //
                    "    \"measure\": \"[{\\\"name\\\": \\\"금액\\\", \\\"uniqueName\\\": \\\"금액\\\", \\\"caption\\\": \\\"금액\\\", \\\"fieldId\\\": \\\"dataItem0\\\", \\\"summaryType\\\": \\\"SUM\\\"}]\",\r\n"
                    + //
                    "    \"dimension\": \"[{\\\"name\\\":\\\"생산회사이름\\\",\\\"uniqueName\\\":\\\"생산회사이름\\\",\\\"caption\\\":\\\"생산회사이름\\\",\\\"fieldId\\\":\\\"dataItem1\\\"},{\\\"name\\\":\\\"결재구분명\\\",\\\"uniqueName\\\":\\\"결재구분명\\\",\\\"caption\\\":\\\"결재구분명\\\",\\\"fieldId\\\":\\\"dataItem2\\\"}]\",\r\n"
                    + //
                    "    \"pagingOption\": \"{\\\"pagingEnabled\\\": true, \\\"start\\\": 0, \\\"size\\\": 3}\"\r\n" + //
                    "}")
    }))
    @PostMapping(value = "/item-data")
    public ReportResult getItemData(HttpServletResponse response, @RequestBody Map<String, String> param)
            throws Exception {
        Gson gson = new Gson();
        String dimensionsStr = param.getOrDefault("dimension", "[]");
        String measuresStr = param.getOrDefault("measure", "[]");
        String sortByItemsStr = param.getOrDefault("sortByItem", "[]");
        String datasetStr = param.get("dataset");
        String parameterStr = param.getOrDefault("parameter", "[]");
        String ItemTypeStr = param.get("itemType");
        String userId = param.get("userId");
        String pagingOptionStr = param.getOrDefault("pagingOption", "");
        String filterStr = param.getOrDefault("filter", "{}");

        List<Dimension> dimensions = gson.fromJson(dimensionsStr,
                new TypeToken<ArrayList<Dimension>>() {
                }.getType());
        List<Measure> measures = gson.fromJson(measuresStr,
                new TypeToken<ArrayList<Measure>>() {
                }.getType());
        List<Measure> sortByItems = gson.fromJson(sortByItemsStr,
                new TypeToken<ArrayList<Measure>>() {
                }.getType());
        List<com.wise.MarketingPlatForm.report.domain.data.data.Parameter> parameters = gson.fromJson(parameterStr,
                new TypeToken<ArrayList<com.wise.MarketingPlatForm.report.domain.data.data.Parameter>>() {
                }.getType());
        Map<String, List<String>> filter = gson.fromJson(filterStr,
                new TypeToken<HashMap<String, ArrayList<String>>> () {
                }.getType());
        Dataset dataset = gson.fromJson(datasetStr, Dataset.class);
        PagingOption pagingOption = gson.fromJson(pagingOptionStr, PagingOption.class);
        ItemType itemType = ItemType.fromString(ItemTypeStr).get();
        boolean removeNullData = param.getOrDefault("removeNullData", "false").equals("true");

        DataAggregation dataAggreagtion = DataAggregation.builder()
                .dataset(dataset)
                .measures(measures)
                .dimensions(dimensions)
                .sortByItems(sortByItems)
                .itemType(itemType)
                .userId(userId)
                .parameters(parameters)
                .removeNullData(removeNullData)
                .pagingOption(pagingOption)
                .filter(filter)
                .build();

        // 추후 PivotMatrix 적용시 주석 해제
        // if (itemType == ItemType.PIVOT_GRID) {
        //     final String pagingParamValue = param.get("paging");
        //     final ObjectNode pagingParamNode = StringUtils.isNotBlank(pagingParamValue)
        //             ? (ObjectNode) objectMapper.readTree(pagingParamValue)
        //             : null;
        //     final PagingParam pagingParam = ParamUtils.toPagingParam(objectMapper, pagingParamNode);

        //     return reportService.getPivotData(param, pagingParam, dataAggreagtion);
        // } else {
        //     return reportService.getItemData(dataAggreagtion);
        // }
        
        return reportService.getItemData(dataAggreagtion);
    }

    @Operation(
	    summary = "get report",
	    description = "reportId로 보고서를 불러옵니다.")
	@Parameters({
	    @Parameter(name = "reportId", description = "report id", example = "8486", required = true),
	    @Parameter(name = "userId", description = "user id", example = "admin", required = true),
	})
	@io.swagger.v3.oas.annotations.parameters.RequestBody(
	    content = @Content(
	        examples = {
	            @ExampleObject(name = "example", value = "{\"reportId\": \"8486\", \"userId\": \"admin\"}")
	        }
	    )
	)
    @PostMapping(value = "/report")
	public Map<String, Object> getReport(@RequestBody Map<String, String> param) {
        String reportId = param.getOrDefault("reportId", "");
        String userId = param.getOrDefault("userId", "");

        return reportService.getReport(reportId, userId);
	}

    @Operation(
	    summary = "get detailed data",
	    description = "상세데이터 조회 결과를 반환합니다.")
	@Parameters({
	    @Parameter(name = "dsId", description = "dataSourceId", example = "2703", required = true),
	    @Parameter(name = "userId", description = "user id", example = "admin", required = true),
        @Parameter(name = "cubeId", description = "cube id", example = "3465", required = true),
        @Parameter(name = "actId", description = "act id", example = "1001", required = true),
        @Parameter(name = "parameter", description = "적용할 필터", example = "[]", required = true),
	})
	@io.swagger.v3.oas.annotations.parameters.RequestBody(
	    content = @Content(
	        examples = {
	            @ExampleObject(name = "example", value = "{\r\n" + //
	                    "  \"dsId\": \"2703\",\r\n" + //
	                    "  \"userId\": \"admin\",\r\n" + //
	                    "  \"cubeId\": \"3465\",\r\n" + //
	                    "  \"actId\": \"1001\",\r\n" + //
	                    "  \"parameter\": \"[{\\\"dataType\\\":\\\"STRING\\\",\\\"dsId\\\":2703,\\\"dsType\\\":\\\"CUBE\\\",\\\"exceptionValue\\\":\\\"DEMO_06_D_유통_매출형태.SALES_FORM_NM\\\",\\\"dataSource\\\":\\\"DEMO_06_D_유통_매출형태\\\",\\\"itemCaption\\\":\\\"SALES_FORM_NM\\\",\\\"itemKey\\\":\\\"SALES_FORM_NM\\\",\\\"name\\\":\\\"@C_SALES_FORM_NM\\\",\\\"operation\\\":\\\"In\\\",\\\"paramType\\\":\\\"LIST\\\",\\\"uniqueName\\\":\\\"[DEMO_06_D_유통_매출형태].[SALES_FORM_NM]\\\",\\\"values\\\":[\\\"직접판매\\\"]},{\\\"dataType\\\":\\\"STRING\\\",\\\"dsId\\\":2703,\\\"dsType\\\":\\\"CUBE\\\",\\\"exceptionValue\\\":\\\"DEMO_06_D_유통_매장.STORE_NM\\\",\\\"dataSource\\\":\\\"DEMO_06_D_유통_매장\\\",\\\"itemCaption\\\":\\\"STORE_NM\\\",\\\"itemKey\\\":\\\"STORE_NM\\\",\\\"name\\\":\\\"@R_STORE_NM\\\",\\\"operation\\\":\\\"In\\\",\\\"paramType\\\":\\\"LIST\\\",\\\"uniqueName\\\":\\\"[DEMO_06_D_유통_매장].[STORE_NM]\\\",\\\"values\\\":[\\\"강릉점\\\"]},{\\\"name\\\":\\\"@DEMO_06_D_유통_매출형태_SALES_FORM_NM\\\",\\\"values\\\":[\\\"직접판매\\\"],\\\"exceptionValue\\\":\\\"DEMO_06_D_유통_매출형태.SALES_FORM_NM\\\",\\\"dataType\\\":\\\"STRING\\\",\\\"operation\\\":\\\"IN\\\",\\\"dsType\\\":\\\"CUBE\\\",\\\"dsId\\\":2703,\\\"uniqueName\\\":\\\"[DEMO_06_D_유통_매출형태].[SALES_FORM_NM]\\\",\\\"paramType\\\":\\\"LIST\\\",\\\"itemCaption\\\":\\\"SALES_FORM_NM\\\",\\\"itemKey\\\":\\\"SALES_FORM_NM\\\"}]\"\r\n" + //
	                    "}")
	        }
	    )
	)
    @PostMapping(value = "/detailed-data")
    public MartResultDTO getDetailedData(@RequestBody Map<String, String> param) {
        Gson gson = new Gson();

        String dsId = param.getOrDefault("dsId", "");
        String cubeId = param.getOrDefault("cubeId", "");
        String userId = param.getOrDefault("userId", "");
        String actId = param.getOrDefault("actId", "");
        String parameterStr = param.getOrDefault("parameter", "[]");

        List<com.wise.MarketingPlatForm.report.domain.data.data.Parameter> parameters = gson.fromJson(parameterStr,
        new TypeToken<ArrayList<com.wise.MarketingPlatForm.report.domain.data.data.Parameter>>() {
        }.getType());


        return reportService.getDetailedData(userId, dsId, cubeId, actId, parameters);
	}

    @Operation(
	    summary = "get report list",
	    description = "설정한 타입과 userId에 맞는 보고서를 반환합니다.")
	@Parameters({
	    @Parameter(name = "reportType", description = "All, Excel, DashAny, AdHoc 중 하나 입력", example = "All", required = true),
	    @Parameter(name = "userId", description = "user id", example = "admin", required = true),
        @Parameter(name = "editMode", description = "designer, viewer, config 중 하나 입력력", example = "designer", required = true),
	})
	@io.swagger.v3.oas.annotations.parameters.RequestBody(
	    content = @Content(
	        examples = {
	            @ExampleObject(name = "example", value = "{\"fldType\": \"All\", \"userId\": \"admin\", \"editMode\": \"desinger\"}")
	        }
	    )
	)
	@PostMapping(value = "/report-list")
    public Map<String, List<ReportListDTO>> getReportList(@RequestBody Map<String, String> param) {
    	// 로그인 기능이 개발된 뒤에 필수 정보를 param.get()으로 변경 bjsong
        String userId = param.getOrDefault("userId", "");
        String reportTypeStr = param.getOrDefault("reportType", "");
        String editModeStr = param.getOrDefault("editMode", "viewer");

        ReportType reportType = ReportType.fromString(reportTypeStr).orElse(ReportType.ALL);
        EditMode editMode = EditMode.fromString(editModeStr).orElse(null);
        return reportService.getReportList(userId, reportType, editMode);
    }
    @PostMapping(value = "/save-report")
	public ReportMstrDTO addReport(@RequestBody Map<String, String> param) {
        Gson gson = new Gson();
        ReportMstrDTO reportMstrDTO = gson.fromJson(gson.toJson(param), ReportMstrDTO.class);
        reportMstrDTO.setReportType(ReportType.DASH_ANY);

        return reportService.addReport(reportMstrDTO);
	}

    @PostMapping(value = "/report-folder-list")
	public Map<String, List<FolderMasterVO>> getReportFolderList(@RequestBody Map<String, String> param) {
        String userId = param.getOrDefault("userId", "");

        return reportService.getReportFolderList(userId);
	}

    @PostMapping(value = "/delete-report")
	public int deleteReport(@RequestBody Map<String, String> param) {
        String reportId = param.getOrDefault("reportId", "");

        return reportService.deleteReport(Integer.parseInt(reportId));
	}
}
