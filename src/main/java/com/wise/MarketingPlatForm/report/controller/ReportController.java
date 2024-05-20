package com.wise.MarketingPlatForm.report.controller;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.login.service.LoginService;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.AdHocOption;
import com.wise.MarketingPlatForm.report.domain.data.data.Dataset;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.PagingOption;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
import com.wise.MarketingPlatForm.report.service.ReportService;
import com.wise.MarketingPlatForm.report.type.EditMode;
import com.wise.MarketingPlatForm.report.type.ItemType;
import com.wise.MarketingPlatForm.report.type.ReportType;
import com.wise.MarketingPlatForm.report.vo.ReportListDTO;
import com.wise.MarketingPlatForm.report.vo.FolderMasterVO;
import com.wise.MarketingPlatForm.report.vo.ReportLinkMstrDTO;
import com.wise.MarketingPlatForm.report.vo.ReportLinkSubMstrDTO;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;
import com.wise.MarketingPlatForm.utils.ListUtility;

import java.lang.reflect.Type;

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
        String temporaryMeasuresStr = param.get("temporaryMeasures");
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
        List<Measure> temporaryMeasures = gson.fromJson(temporaryMeasuresStr,
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
        AdHocOption adHocOption = new AdHocOption(null, null);
        
        ListUtility.getInstance().removeNullInParameterList(measures);
        ListUtility.getInstance().removeNullInParameterList(temporaryMeasures);
        ListUtility.getInstance().removeNullInParameterList(dimensions);
        ListUtility.getInstance().removeNullInParameterList(sortByItems);

        List<Measure> mergeMeasures = new ArrayList<>();

        for (Measure measure : temporaryMeasures) mergeMeasures.add(measure);
        for (Measure measure : measures) mergeMeasures.add(measure);
        
        DataAggregation dataAggreagtion = DataAggregation.builder()
                .dataset(dataset)
                .measures(mergeMeasures)
                .originalMeasures(measures)
                .dimensions(dimensions)
                .sortByItems(sortByItems)
                .itemType(itemType)
                .userId(userId)
                .parameters(parameters)
                .removeNullData(removeNullData)
                .pagingOption(pagingOption)
                .filter(filter)
                .adHocOption(adHocOption)
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

    @Operation(summary = "adhoc-item-data", description = "아이템의 데이터를 조회합니다.")
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
                    "    \"measure\": \"[{\\\"name\\\": \\\"금액\\\", \\\"uniqueName\\\": \\\"금액\\\", \\\"caption\\\": \\\"금액\\\", \\\"fieldId\\\": \\\"dataItem0\\\", \\\"summaryType\\\": \\\"SUM\\\"}]\",\r\n"
                    + //
                    "    \"dimension\": \"[{\\\"name\\\":\\\"생산회사이름\\\",\\\"uniqueName\\\":\\\"생산회사이름\\\",\\\"caption\\\":\\\"생산회사이름\\\",\\\"fieldId\\\":\\\"dataItem1\\\"},{\\\"name\\\":\\\"결재구분명\\\",\\\"uniqueName\\\":\\\"결재구분명\\\",\\\"caption\\\":\\\"결재구분명\\\",\\\"fieldId\\\":\\\"dataItem2\\\"}]\",\r\n"
                    + //
                    "    \"pagingOption\": \"{\\\"pagingEnabled\\\": true, \\\"start\\\": 0, \\\"size\\\": 3}\"\r\n" + //
                    "}")
    }))
    @PostMapping(value = "/adhoc-item-data")
    public Map<String, ReportResult> getAdHocItemData(HttpServletResponse response, @RequestBody Map<String, String> param)
            throws Exception {
        Gson gson = new Gson();
        String dimensionsStr = param.getOrDefault("dimension", "[]");
        String measuresStr = param.getOrDefault("measure", "[]");
        String temporaryMeasuresStr = param.get("temporaryMeasures");
        String sortByItemsStr = param.getOrDefault("sortByItem", "[]");
        String datasetStr = param.get("dataset");
        String parameterStr = param.getOrDefault("parameter", "[]");
        String userId = param.get("userId");
        String pagingOptionStr = param.getOrDefault("pagingOption", "");
        String adHocOptionStr = param.get("adHocOption");

        List<Dimension> dimensions = gson.fromJson(dimensionsStr,
                new TypeToken<ArrayList<Dimension>>() {
                }.getType());
        List<Measure> measures = gson.fromJson(measuresStr,
                new TypeToken<ArrayList<Measure>>() {
                }.getType());
        List<Measure> temporaryMeasures = gson.fromJson(temporaryMeasuresStr,
                new TypeToken<ArrayList<Measure>>() {
                }.getType());
        List<Measure> sortByItems = gson.fromJson(sortByItemsStr,
                new TypeToken<ArrayList<Measure>>() {
                }.getType());
        List<com.wise.MarketingPlatForm.report.domain.data.data.Parameter> parameters = gson.fromJson(parameterStr,
                new TypeToken<ArrayList<com.wise.MarketingPlatForm.report.domain.data.data.Parameter>>() {
                }.getType());
        Dataset dataset = gson.fromJson(datasetStr, Dataset.class);
        PagingOption pagingOption = gson.fromJson(pagingOptionStr, PagingOption.class);
        AdHocOption adHocOption = gson.fromJson(adHocOptionStr, AdHocOption.class);
        ItemType itemType = ItemType.AD_HOC;
        boolean removeNullData = param.getOrDefault("removeNullData", "false").equals("true");

        ListUtility.getInstance().removeNullInParameterList(measures);
        ListUtility.getInstance().removeNullInParameterList(temporaryMeasures);
        ListUtility.getInstance().removeNullInParameterList(dimensions);
        ListUtility.getInstance().removeNullInParameterList(sortByItems);

        List<Measure> mergeMeasures = new ArrayList<>();

        for (Measure measure : temporaryMeasures) mergeMeasures.add(measure);
        for (Measure measure : measures) mergeMeasures.add(measure);


        DataAggregation dataAggreagtion = DataAggregation.builder()
                .dataset(dataset)
                .measures(mergeMeasures)
                .originalMeasures(measures)
                .dimensions(dimensions)
                .sortByItems(sortByItems)
                .itemType(itemType)
                .userId(userId)
                .parameters(parameters)
                .removeNullData(removeNullData)
                .pagingOption(pagingOption)
                .adHocOption(adHocOption)
                .build();

        return reportService.getAdHocItemData(dataAggreagtion);
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
    public Map<String, List<ReportListDTO>> getReportList(HttpServletRequest request, @RequestBody Map<String, String> param) {
    	// 로그인 기능이 개발된 뒤에 필수 정보를 param.get()으로 변경 bjsong
        HttpSession session = request.getSession();
        UserDTO user = (UserDTO)session.getAttribute("WI_SESSION_USER");
        String userId = user.getUserId();
        String reportTypeStr = param.getOrDefault("reportType", "");
        String editModeStr = param.getOrDefault("editMode", "viewer");

        ReportType reportType = ReportType.fromString(reportTypeStr).orElse(ReportType.ALL);
        EditMode editMode = EditMode.fromString(editModeStr).orElse(null);
        return reportService.getReportList(userId, reportType, editMode);
    }

        @Operation(
	    summary = "insert report",
	    description = "새로운 보고서를 생성합니다.")
	@Parameters({
	    @Parameter(name = "reportId", description = "보고서 id", required = true),
            @Parameter(name = "reportNm", description = "보고서 명", required = true),
            @Parameter(name = "fldId", description = "폴더 id"),
            @Parameter(name = "fldType", description = "폴더 type"),
            @Parameter(name = "fldName", description = "폴더 명"),
            @Parameter(name = "reportOrdinal", description = "보고서 순서"),
            @Parameter(name = "reportType", description = "보고서 type All, Excel, DashAny, AdHoc 중 하나 입력", example = "All", required = true),
            @Parameter(name = "reportTag", description = "보고서 tag"),
            @Parameter(name = "reportDesc", description = "보고서 설명"),
            @Parameter(name = "chartXml", description = "chartXml, 보고서 item 관련 정보, redux 의 item State"),
            @Parameter(name = "layoutXml", description = "layoutXml, 보고서 layout 관련 정보, redux 의 layout State"),
            @Parameter(name = "datasetXml", description = "datasetXml, 보고서 dataset(데이터 집합) 관련 정보, redux 의 dataset State"),
            @Parameter(name = "paramXml", description = "paramXml, 보고서 parameter(매개변수) 관련 정보, redux 의 parameter State"),
            @Parameter(name = "reportXml", description = "reportXml, 보고서 관련 정보, redux 의 report State"),
            @Parameter(name = "reportSbuTitle", description = "보고서 부제목")
	})
	@io.swagger.v3.oas.annotations.parameters.RequestBody(
	    content = @Content(
	        examples = {
	            @ExampleObject(name = "example", value = "{\"reportNm\":\"새 보고서_TEST1\",\"fldId\":1621,\"fldType\":\"PUBLIC\",\"fldName\":\"00.Sample\",\"reportOrdinal\":0,\"reportType\":\"DashAny\",\"reportTag\":\"보고서 주석 입니다.\",\"reportDesc\":\"보고서 설명 입니다.\",\"chartXml\":\"{\\\"selectedItemId\\\":\\\"item1\\\",\\\"itemQuantity\\\":1,\\\"items\\\":[{\\\"id\\\":\\\"item1\\\",\\\"type\\\":\\\"chart\\\",\\\"meta\\\":{\\\"interactiveOption\\\":{\\\"mode\\\":\\\"single\\\",\\\"enabled\\\":false,\\\"ignoreMasterFilter\\\":false,\\\"crossDataSource\\\":false,\\\"targetDimension\\\":\\\"dimension\\\"},\\\"name\\\":\\\"아이템\\\",\\\"memo\\\":\\\"\\\",\\\"useCaption\\\":true,\\\"dataField\\\":{\\\"dataFieldQuantity\\\":3,\\\"measure\\\":[{\\\"name\\\":\\\"SUM(금액)\\\",\\\"uniqueName\\\":\\\"SUM(금액)\\\",\\\"caption\\\":\\\"SUM(금액)\\\",\\\"category\\\":\\\"measure\\\",\\\"fieldType\\\":\\\"MEA\\\",\\\"type\\\":\\\"MEA\\\",\\\"fieldId\\\":\\\"dataItem0\\\",\\\"format\\\":{},\\\"summaryType\\\":\\\"SUM\\\"}],\\\"dimension\\\":[{\\\"name\\\":\\\"자동차\\\",\\\"uniqueName\\\":\\\"자동차\\\",\\\"caption\\\":\\\"자동차\\\",\\\"category\\\":\\\"dimension\\\",\\\"fieldType\\\":\\\"DIM\\\",\\\"type\\\":\\\"DIM\\\",\\\"fieldId\\\":\\\"dataItem1\\\",\\\"sortBy\\\":\\\"dataItem1\\\",\\\"sortOrder\\\":\\\"ASC\\\"}],\\\"dimensionGroup\\\":[{\\\"name\\\":\\\"결재구분\\\",\\\"uniqueName\\\":\\\"결재구분\\\",\\\"caption\\\":\\\"결재구분\\\",\\\"category\\\":\\\"dimensionGroup\\\",\\\"fieldType\\\":\\\"DIM\\\",\\\"type\\\":\\\"DIM\\\",\\\"fieldId\\\":\\\"dataItem2\\\",\\\"sortBy\\\":\\\"dataItem2\\\",\\\"sortOrder\\\":\\\"ASC\\\"}],\\\"sortByItem\\\":[],\\\"datasetId\\\":\\\"dataset1\\\"}}}]}\",\"layoutXml\":\"{\\\"layoutQuantity\\\":1,\\\"layoutConfig\\\":{\\\"global\\\":{\\\"tabEnableClose\\\":false,\\\"tabEnableRename\\\":false},\\\"borders\\\":[],\\\"layout\\\":{\\\"type\\\":\\\"row\\\",\\\"children\\\":[{\\\"type\\\":\\\"tabset\\\",\\\"weight\\\":50,\\\"selected\\\":0,\\\"children\\\":[{\\\"className\\\":\\\"item1\\\",\\\"id\\\":\\\"item1\\\",\\\"type\\\":\\\"tab\\\",\\\"name\\\":\\\"Chart 1\\\",\\\"component\\\":\\\"chart\\\"}]}]}}}\",\"datasetXml\":\"{\\\"selectedDatasetId\\\":\\\"dataset1\\\",\\\"datasetQuantity\\\":1,\\\"datasets\\\":[{\\\"datasetNm\\\":\\\"데이터집합\\\",\\\"datasetType\\\":\\\"DS_SQL\\\",\\\"dataSrcId\\\":3263,\\\"datasetQuery\\\":\\\"select sum(금액), 자동차, 결재구분\\\\nfrom f_자동차_작업일지_20200916_2\\\\ngroup by 자동차, 결재구분\\\",\\\"datasetId\\\":\\\"dataset1\\\",\\\"fields\\\":[{\\\"name\\\":\\\"데이터집합\\\",\\\"type\\\":\\\"FLD\\\",\\\"uniqueName\\\":\\\"0\\\",\\\"icon\\\":\\\"/static/media/folder_load.ffa38386a00592184591.png\\\"},{\\\"icon\\\":\\\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAC8klEQVRYhe2XOWhUQRjH/xqNR2Njl2Dh0UhiYWERLGSJQYOihY0oQaKYsFlzuZs9Yu5kj2RzGiXxCBgUCxEMxjSGxM5KECJWMZVRQQvxQgLOX2azwrDuPN+xq4X7g+HxZr437/fmffNmHnLkyGHMGl3rlfHJIIB2APlZHMMlAEdrqipe6gLWai8lO0Dmg0QWy3aQHqMnWKdrEOQCgL3mB8M2m20JkjwG4CmAwpSmMID3DqUiADaaCdTmoGR4dGIngCcACpTqFwBcdZ5K25LDoxMfAWxJnt6q81Se0cXqcxBAnadykeRhkh9IIlmKSE4PXb756waWUfpKFCMMBSX1F84ukDxI8pPS6T6SM4MjNwzzRwfJZaWvN44EJQ21554LskyQXwWJZCkR5HT/8HVTuaQiyNOCnBLkmCCjRrGGOZhKfPCaC8A0gE1K00MAJ7wN51esiprBkqCkd2C8HMADAOuV6nsATjY1Vv3454KSWHzsOID7KSlyG0CF31ttnPUWsSUoifRdPQVgMkVyDIA76HNnTNLUJElH0Oe+IwTdQhBKqRaCvZmSk+Q5uXhuduaZq7RcfnQPKdUlrtLyvLnZmXnneg5esUpneCSQXL5UylpDtY+d9m37FauQfETye8oKsSsTfWs3C2Zp6xoqFoJzKYv/i+SsdoyjV9zSMVAsUxHAVqX6FYD9XW2N7zIhaHuSXGrvLwIwn0buQHf7RcP11Qq2RjDUGk+3DUvIhTu9rzMlBzuCgZY+rVy0y5dROVgV9DfHtHKxHn/G5WBF0BeKauX6woGsyMGsoDcQSSe3LOXi0eCi1Zt6A5E9cp4BeCuP8Wjwsy72j9/BRn94myDTyg3EQpblsLphvQtgd/L0C4BmW4INTT2FZOIj/JvcYG+zLTmsrjxqfwUGoXrBel+3lJMjtyOlSW5Wj9T7um3qJQQ3mI3V/xcLTqWRk9TYNrOB0Y978V9y+GbUqN3NCLJNkCvKX1w2ypIgR7Py2Dly/BcA+AlE0cjrPRlcbgAAAABJRU5ErkJggg==\\\",\\\"parentId\\\":\\\"0\\\",\\\"uniqueName\\\":\\\"SUM(금액)\\\",\\\"name\\\":\\\"SUM(금액)\\\",\\\"type\\\":\\\"MEA\\\",\\\"columnName\\\":\\\"SUM(금액)\\\",\\\"columnLabel\\\":\\\"SUM(금액)\\\",\\\"columnType\\\":\\\"2\\\",\\\"columnTypeName\\\":\\\"decimal\\\"},{\\\"icon\\\":\\\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABdUlEQVRYhe2XMWrDMBSG/0IP0AN0yNADZMyYbD1AZ9MtAS8tBDR4qDN4EBjaxZBswXMP0K0ZPeYAGTLkADnBUzF4EK7s9+TJAX2j/En+kWQ9C4FAoJ8719NiVxqm3yZeRmmxK+cAfhl3ES+jQ7ErUwAffWK8jP7luXeahsvn6fmM2cIZkISDST1f18YZ0AgHk3q+ro07IAkDCj1f1+ZGZ3DsAcf/kZB5Z/pVjXcCwLmnxv0BcB2Ucsw4K4nOt3Mm81mtV2edbx8ATBn3qNarq863EwCTPlGtV4d2W8ceJK58bQCkZGgqKXUADmTolSt1rglzBxSeWVLP17W50WOGSNRZ6vm6Nrc6gyPfg2GJPeha4gUzxLnxjs0518excff1eTgo5ZhxljqV6Dcmc6UzValEPwJ4YdxvnamLSvQMwKxP1Jn6ard1/W59Mi+tS11FxjwB4Nx6iS9kzLOg1MkCjv6XP9zqPAjXziGuTbjVDXEDgYAUAH+JBBrmqr/0FQAAAABJRU5ErkJggg==\\\",\\\"parentId\\\":\\\"0\\\",\\\"uniqueName\\\":\\\"자동차\\\",\\\"name\\\":\\\"자동차\\\",\\\"type\\\":\\\"DIM\\\",\\\"columnName\\\":\\\"자동차\\\",\\\"columnLabel\\\":\\\"자동차\\\",\\\"columnType\\\":\\\"12\\\",\\\"columnTypeName\\\":\\\"VARCHAR2\\\"},{\\\"icon\\\":\\\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABdUlEQVRYhe2XMWrDMBSG/0IP0AN0yNADZMyYbD1AZ9MtAS8tBDR4qDN4EBjaxZBswXMP0K0ZPeYAGTLkADnBUzF4EK7s9+TJAX2j/En+kWQ9C4FAoJ8719NiVxqm3yZeRmmxK+cAfhl3ES+jQ7ErUwAffWK8jP7luXeahsvn6fmM2cIZkISDST1f18YZ0AgHk3q+ro07IAkDCj1f1+ZGZ3DsAcf/kZB5Z/pVjXcCwLmnxv0BcB2Ucsw4K4nOt3Mm81mtV2edbx8ATBn3qNarq863EwCTPlGtV4d2W8ceJK58bQCkZGgqKXUADmTolSt1rglzBxSeWVLP17W50WOGSNRZ6vm6Nrc6gyPfg2GJPeha4gUzxLnxjs0518excff1eTgo5ZhxljqV6Dcmc6UzValEPwJ4YdxvnamLSvQMwKxP1Jn6ard1/W59Mi+tS11FxjwB4Nx6iS9kzLOg1MkCjv6XP9zqPAjXziGuTbjVDXEDgYAUAH+JBBrmqr/0FQAAAABJRU5ErkJggg==\\\",\\\"parentId\\\":\\\"0\\\",\\\"uniqueName\\\":\\\"결재구분\\\",\\\"name\\\":\\\"결재구분\\\",\\\"type\\\":\\\"DIM\\\",\\\"columnName\\\":\\\"결재구분\\\",\\\"columnLabel\\\":\\\"결재구분\\\",\\\"columnType\\\":\\\"12\\\",\\\"columnTypeName\\\":\\\"VARCHAR2\\\"}]}]}\",\"paramXml\":\"[]\",\"reportXml\":\"{\\\"options\\\":{\\\"reportNm\\\":\\\"새 보고서_TEST1\\\",\\\"fldId\\\":1621,\\\"fldType\\\":\\\"PUBLIC\\\",\\\"fldName\\\":\\\"00.Sample\\\",\\\"reportOrdinal\\\":0,\\\"reportType\\\":\\\"DashAny\\\",\\\"reportTag\\\":\\\"보고서 주석 입니다.\\\",\\\"reportDesc\\\":\\\"보고서 설명 입니다.\\\",\\\"chartXml\\\":\\\"{\\\\\\\"selectedItemId\\\\\\\":\\\\\\\"item1\\\\\\\",\\\\\\\"itemQuantity\\\\\\\":1,\\\\\\\"items\\\\\\\":[{\\\\\\\"id\\\\\\\":\\\\\\\"item1\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"chart\\\\\\\",\\\\\\\"meta\\\\\\\":{\\\\\\\"interactiveOption\\\\\\\":{\\\\\\\"mode\\\\\\\":\\\\\\\"single\\\\\\\",\\\\\\\"enabled\\\\\\\":false,\\\\\\\"ignoreMasterFilter\\\\\\\":false,\\\\\\\"crossDataSource\\\\\\\":false,\\\\\\\"targetDimension\\\\\\\":\\\\\\\"dimension\\\\\\\"},\\\\\\\"name\\\\\\\":\\\\\\\"아이템\\\\\\\",\\\\\\\"memo\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"useCaption\\\\\\\":true,\\\\\\\"dataField\\\\\\\":{\\\\\\\"dataFieldQuantity\\\\\\\":3,\\\\\\\"measure\\\\\\\":[{\\\\\\\"name\\\\\\\":\\\\\\\"SUM(금액)\\\\\\\",\\\\\\\"uniqueName\\\\\\\":\\\\\\\"SUM(금액)\\\\\\\",\\\\\\\"caption\\\\\\\":\\\\\\\"SUM(금액)\\\\\\\",\\\\\\\"category\\\\\\\":\\\\\\\"measure\\\\\\\",\\\\\\\"fieldType\\\\\\\":\\\\\\\"MEA\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"MEA\\\\\\\",\\\\\\\"fieldId\\\\\\\":\\\\\\\"dataItem0\\\\\\\",\\\\\\\"format\\\\\\\":{},\\\\\\\"summaryType\\\\\\\":\\\\\\\"SUM\\\\\\\"}],\\\\\\\"dimension\\\\\\\":[{\\\\\\\"name\\\\\\\":\\\\\\\"자동차\\\\\\\",\\\\\\\"uniqueName\\\\\\\":\\\\\\\"자동차\\\\\\\",\\\\\\\"caption\\\\\\\":\\\\\\\"자동차\\\\\\\",\\\\\\\"category\\\\\\\":\\\\\\\"dimension\\\\\\\",\\\\\\\"fieldType\\\\\\\":\\\\\\\"DIM\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"DIM\\\\\\\",\\\\\\\"fieldId\\\\\\\":\\\\\\\"dataItem1\\\\\\\",\\\\\\\"sortBy\\\\\\\":\\\\\\\"dataItem1\\\\\\\",\\\\\\\"sortOrder\\\\\\\":\\\\\\\"ASC\\\\\\\"}],\\\\\\\"dimensionGroup\\\\\\\":[{\\\\\\\"name\\\\\\\":\\\\\\\"결재구분\\\\\\\",\\\\\\\"uniqueName\\\\\\\":\\\\\\\"결재구분\\\\\\\",\\\\\\\"caption\\\\\\\":\\\\\\\"결재구분\\\\\\\",\\\\\\\"category\\\\\\\":\\\\\\\"dimensionGroup\\\\\\\",\\\\\\\"fieldType\\\\\\\":\\\\\\\"DIM\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"DIM\\\\\\\",\\\\\\\"fieldId\\\\\\\":\\\\\\\"dataItem2\\\\\\\",\\\\\\\"sortBy\\\\\\\":\\\\\\\"dataItem2\\\\\\\",\\\\\\\"sortOrder\\\\\\\":\\\\\\\"ASC\\\\\\\"}],\\\\\\\"sortByItem\\\\\\\":[],\\\\\\\"datasetId\\\\\\\":\\\\\\\"dataset1\\\\\\\"}}}]}\\\",\\\"layoutXml\\\":\\\"{\\\\\\\"layoutQuantity\\\\\\\":1,\\\\\\\"layoutConfig\\\\\\\":{\\\\\\\"global\\\\\\\":{\\\\\\\"tabEnableClose\\\\\\\":false,\\\\\\\"tabEnableRename\\\\\\\":false},\\\\\\\"borders\\\\\\\":[],\\\\\\\"layout\\\\\\\":{\\\\\\\"type\\\\\\\":\\\\\\\"row\\\\\\\",\\\\\\\"children\\\\\\\":[{\\\\\\\"type\\\\\\\":\\\\\\\"tabset\\\\\\\",\\\\\\\"weight\\\\\\\":50,\\\\\\\"selected\\\\\\\":0,\\\\\\\"children\\\\\\\":[{\\\\\\\"className\\\\\\\":\\\\\\\"item1\\\\\\\",\\\\\\\"id\\\\\\\":\\\\\\\"item1\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"tab\\\\\\\",\\\\\\\"name\\\\\\\":\\\\\\\"Chart 1\\\\\\\",\\\\\\\"component\\\\\\\":\\\\\\\"chart\\\\\\\"}]}]}}}\\\",\\\"datasetXml\\\":\\\"{\\\\\\\"selectedDatasetId\\\\\\\":\\\\\\\"dataset1\\\\\\\",\\\\\\\"datasetQuantity\\\\\\\":1,\\\\\\\"datasets\\\\\\\":[{\\\\\\\"datasetNm\\\\\\\":\\\\\\\"데이터집합\\\\\\\",\\\\\\\"datasetType\\\\\\\":\\\\\\\"DS_SQL\\\\\\\",\\\\\\\"dataSrcId\\\\\\\":3263,\\\\\\\"datasetQuery\\\\\\\":\\\\\\\"select sum(금액), 자동차, 결재구분\\\\\\\\nfrom f_자동차_작업일지_20200916_2\\\\\\\\ngroup by 자동차, 결재구분\\\\\\\",\\\\\\\"datasetId\\\\\\\":\\\\\\\"dataset1\\\\\\\",\\\\\\\"fields\\\\\\\":[{\\\\\\\"name\\\\\\\":\\\\\\\"데이터집합\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"FLD\\\\\\\",\\\\\\\"uniqueName\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"icon\\\\\\\":\\\\\\\"/static/media/folder_load.ffa38386a00592184591.png\\\\\\\"},{\\\\\\\"icon\\\\\\\":\\\\\\\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAC8klEQVRYhe2XOWhUQRjH/xqNR2Njl2Dh0UhiYWERLGSJQYOihY0oQaKYsFlzuZs9Yu5kj2RzGiXxCBgUCxEMxjSGxM5KECJWMZVRQQvxQgLOX2azwrDuPN+xq4X7g+HxZr437/fmffNmHnLkyGHMGl3rlfHJIIB2APlZHMMlAEdrqipe6gLWai8lO0Dmg0QWy3aQHqMnWKdrEOQCgL3mB8M2m20JkjwG4CmAwpSmMID3DqUiADaaCdTmoGR4dGIngCcACpTqFwBcdZ5K25LDoxMfAWxJnt6q81Se0cXqcxBAnadykeRhkh9IIlmKSE4PXb756waWUfpKFCMMBSX1F84ukDxI8pPS6T6SM4MjNwzzRwfJZaWvN44EJQ21554LskyQXwWJZCkR5HT/8HVTuaQiyNOCnBLkmCCjRrGGOZhKfPCaC8A0gE1K00MAJ7wN51esiprBkqCkd2C8HMADAOuV6nsATjY1Vv3454KSWHzsOID7KSlyG0CF31ttnPUWsSUoifRdPQVgMkVyDIA76HNnTNLUJElH0Oe+IwTdQhBKqRaCvZmSk+Q5uXhuduaZq7RcfnQPKdUlrtLyvLnZmXnneg5esUpneCSQXL5UylpDtY+d9m37FauQfETye8oKsSsTfWs3C2Zp6xoqFoJzKYv/i+SsdoyjV9zSMVAsUxHAVqX6FYD9XW2N7zIhaHuSXGrvLwIwn0buQHf7RcP11Qq2RjDUGk+3DUvIhTu9rzMlBzuCgZY+rVy0y5dROVgV9DfHtHKxHn/G5WBF0BeKauX6woGsyMGsoDcQSSe3LOXi0eCi1Zt6A5E9cp4BeCuP8Wjwsy72j9/BRn94myDTyg3EQpblsLphvQtgd/L0C4BmW4INTT2FZOIj/JvcYG+zLTmsrjxqfwUGoXrBel+3lJMjtyOlSW5Wj9T7um3qJQQ3mI3V/xcLTqWRk9TYNrOB0Y978V9y+GbUqN3NCLJNkCvKX1w2ypIgR7Py2Dly/BcA+AlE0cjrPRlcbgAAAABJRU5ErkJggg==\\\\\\\",\\\\\\\"parentId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"uniqueName\\\\\\\":\\\\\\\"SUM(금액)\\\\\\\",\\\\\\\"name\\\\\\\":\\\\\\\"SUM(금액)\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"MEA\\\\\\\",\\\\\\\"columnName\\\\\\\":\\\\\\\"SUM(금액)\\\\\\\",\\\\\\\"columnLabel\\\\\\\":\\\\\\\"SUM(금액)\\\\\\\",\\\\\\\"columnType\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"columnTypeName\\\\\\\":\\\\\\\"decimal\\\\\\\"},{\\\\\\\"icon\\\\\\\":\\\\\\\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABdUlEQVRYhe2XMWrDMBSG/0IP0AN0yNADZMyYbD1AZ9MtAS8tBDR4qDN4EBjaxZBswXMP0K0ZPeYAGTLkADnBUzF4EK7s9+TJAX2j/En+kWQ9C4FAoJ8719NiVxqm3yZeRmmxK+cAfhl3ES+jQ7ErUwAffWK8jP7luXeahsvn6fmM2cIZkISDST1f18YZ0AgHk3q+ro07IAkDCj1f1+ZGZ3DsAcf/kZB5Z/pVjXcCwLmnxv0BcB2Ucsw4K4nOt3Mm81mtV2edbx8ATBn3qNarq863EwCTPlGtV4d2W8ceJK58bQCkZGgqKXUADmTolSt1rglzBxSeWVLP17W50WOGSNRZ6vm6Nrc6gyPfg2GJPeha4gUzxLnxjs0518excff1eTgo5ZhxljqV6Dcmc6UzValEPwJ4YdxvnamLSvQMwKxP1Jn6ard1/W59Mi+tS11FxjwB4Nx6iS9kzLOg1MkCjv6XP9zqPAjXziGuTbjVDXEDgYAUAH+JBBrmqr/0FQAAAABJRU5ErkJggg==\\\\\\\",\\\\\\\"parentId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"uniqueName\\\\\\\":\\\\\\\"자동차\\\\\\\",\\\\\\\"name\\\\\\\":\\\\\\\"자동차\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"DIM\\\\\\\",\\\\\\\"columnName\\\\\\\":\\\\\\\"자동차\\\\\\\",\\\\\\\"columnLabel\\\\\\\":\\\\\\\"자동차\\\\\\\",\\\\\\\"columnType\\\\\\\":\\\\\\\"12\\\\\\\",\\\\\\\"columnTypeName\\\\\\\":\\\\\\\"VARCHAR2\\\\\\\"},{\\\\\\\"icon\\\\\\\":\\\\\\\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABdUlEQVRYhe2XMWrDMBSG/0IP0AN0yNADZMyYbD1AZ9MtAS8tBDR4qDN4EBjaxZBswXMP0K0ZPeYAGTLkADnBUzF4EK7s9+TJAX2j/En+kWQ9C4FAoJ8719NiVxqm3yZeRmmxK+cAfhl3ES+jQ7ErUwAffWK8jP7luXeahsvn6fmM2cIZkISDST1f18YZ0AgHk3q+ro07IAkDCj1f1+ZGZ3DsAcf/kZB5Z/pVjXcCwLmnxv0BcB2Ucsw4K4nOt3Mm81mtV2edbx8ATBn3qNarq863EwCTPlGtV4d2W8ceJK58bQCkZGgqKXUADmTolSt1rglzBxSeWVLP17W50WOGSNRZ6vm6Nrc6gyPfg2GJPeha4gUzxLnxjs0518excff1eTgo5ZhxljqV6Dcmc6UzValEPwJ4YdxvnamLSvQMwKxP1Jn6ard1/W59Mi+tS11FxjwB4Nx6iS9kzLOg1MkCjv6XP9zqPAjXziGuTbjVDXEDgYAUAH+JBBrmqr/0FQAAAABJRU5ErkJggg==\\\\\\\",\\\\\\\"parentId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"uniqueName\\\\\\\":\\\\\\\"결재구분\\\\\\\",\\\\\\\"name\\\\\\\":\\\\\\\"결재구분\\\\\\\",\\\\\\\"type\\\\\\\":\\\\\\\"DIM\\\\\\\",\\\\\\\"columnName\\\\\\\":\\\\\\\"결재구분\\\\\\\",\\\\\\\"columnLabel\\\\\\\":\\\\\\\"결재구분\\\\\\\",\\\\\\\"columnType\\\\\\\":\\\\\\\"12\\\\\\\",\\\\\\\"columnTypeName\\\\\\\":\\\\\\\"VARCHAR2\\\\\\\"}]}]}\\\",\\\"paramXml\\\":\\\"[]\\\"}}\",\"reportSubTitle\":\"보고서 부제목 입니다.\"}")
	        }
	    )
	)
        @PostMapping(value = "/report-save")
        public ResponseEntity<Map<String, Object>> insertReport(
                @RequestBody Map<String, String> param,
                HttpServletRequest request
        ) throws SQLException {
                Gson gson = new Gson();
                HttpSession session = request.getSession();
                UserDTO userDTO = (UserDTO)session.getAttribute("WI_SESSION_USER");
                ReportMstrDTO reportDTO = gson.fromJson(gson.toJson(param), ReportMstrDTO.class);

                String reportTypeStr = param.getOrDefault("reportType", "");
                ReportType reportType = ReportType.fromString(reportTypeStr).orElse(ReportType.ALL);
                reportDTO.setReportType(reportType);
                reportDTO.setRegUserNo(userDTO.getUserNo());

                Map<String, Object> map = reportService.insertReport(reportDTO);

                return ResponseEntity.ok().body(map);
	}

        @PatchMapping(value = "/report-save")
        public ResponseEntity<Map<String, Object>> updateReport(
                @RequestBody Map<String, String> param,
                HttpServletRequest request
        ) throws SQLException {
                Gson gson = new Gson();
                HttpSession session = request.getSession();
                UserDTO userDTO = (UserDTO)session.getAttribute("WI_SESSION_USER");
                ReportMstrDTO reportDTO = gson.fromJson(gson.toJson(param), ReportMstrDTO.class);

                String reportTypeStr = param.getOrDefault("reportType", "");
                ReportType reportType = ReportType.fromString(reportTypeStr).orElse(ReportType.ALL);
                reportDTO.setReportType(reportType);
                reportDTO.setModUserNo(userDTO.getUserNo());

                Map<String, Object> map = reportService.updateReport(reportDTO);

                return ResponseEntity.ok().body(map);
	}

    @PatchMapping(value = "/update")
    public ResponseEntity<RestAPIVO> patchConfigReportData(
      @RequestParam(required = true) int reportId,
      @RequestParam(required = false, defaultValue = "") String reportNm,
      @RequestParam(required = false, defaultValue = "0") String reportSubTitle,
      @RequestParam(required = false, defaultValue = "0") int fldId,
      @RequestParam(required = false, defaultValue = "0") String fldType,
      @RequestParam(required = false, defaultValue = "") int reportOrdinal,
      @RequestParam(required = false, defaultValue = "") String reportType,
      @RequestParam(required = false, defaultValue = "") String reportTag,
      @RequestParam(required = false, defaultValue = "") String reportDesc
    ) throws Exception {
    
      ReportMstrEntity reportMstr = ReportMstrEntity.builder()
          .reportId(reportId)
          .reportNm(reportNm)
          .reportSubTitle(reportSubTitle)
          .fldId(fldId)
          .fldType(fldType)
          .reportOrdinal(reportOrdinal)
          .reportType(reportType)
          .reportDesc(reportDesc)
          .reportTag(reportTag)
          .build();
    
      boolean result = reportService.patchConfigReport(reportMstr);
    
      if (!result) return RestAPIVO.conflictResponse(false);
    
      return RestAPIVO.okResponse(result);
    }

    @PostMapping(value = "/report-folder-list")
	public Map<String, List<FolderMasterVO>> getReportFolderList(@RequestBody Map<String, String> param) {
        String userId = param.getOrDefault("userId", "");
        return reportService.getReportFolderList(userId);
	}

    @PatchMapping(value = "/report-delete")

    public ResponseEntity<Map<String, Object>> deleteReport(@RequestBody Map<String, String> param) throws SQLException {
            Gson gson = new Gson();
            ReportMstrDTO reportDTO = gson.fromJson(gson.toJson(param), ReportMstrDTO.class);
            String reportTypeStr = param.getOrDefault("reportType", "");
            ReportType reportType = ReportType.fromString(reportTypeStr).orElse(ReportType.ALL);
            reportDTO.setReportType(reportType);
            Map<String, Object> map = reportService.deleteReport(reportDTO);

            return ResponseEntity.ok().body(map);
    }
    @PatchMapping(value = "/report-link-save")
    public ResponseEntity<?> insertLinkReport(@RequestBody List<Map<String, Object>> linkReports) {
        Gson gson = new Gson();
        Type listType = new TypeToken<List<ReportLinkMstrDTO>>() {}.getType();
        List<ReportLinkMstrDTO> reportLinkDTO = gson.fromJson(gson.toJson(linkReports), listType);
        reportService.insertLinkReport(reportLinkDTO);
        reportLinkDTO.forEach(subDto -> {
            if (subDto.isSubYn() && subDto.getSubLinkReport() != null) {
                List<ReportLinkSubMstrDTO> reportLinkSubDTO = subDto.getSubLinkReport();
                reportService.insertSubLinkReport(reportLinkSubDTO);
            }
        });
        return ResponseEntity.ok().body("Link reports successfully saved.");
    }
    

    @PostMapping(value = "/report-link-param")
	public Map<String, Object> getLinkReportParam(@RequestBody Map<String, String> param) {
        String reportId = param.getOrDefault("reportId", "");
        return reportService.getLinkReportParam(reportId);
	}

    @PostMapping(value = "/report-link-list", consumes = "application/json")
    public ResponseEntity<Map<String, Object>> getLinkReportList(@RequestBody Map<String, String> param) {
        System.out.println("param = " + param);
        String reportId = param.getOrDefault("reportId", "");
        Map<String, Object> aggregatedReportLinks = reportService.getAggregatedReportLinks(reportId);
        return new ResponseEntity<>(aggregatedReportLinks, HttpStatus.OK);
    }

    private Map<String, UserInfo> tokenStore = new HashMap<>();

    // Endpoint to generate a one-time token
    @PostMapping("/generate-token")
    public Map<String, String> generateToken(@RequestBody Map<String, String> requestBody) {
        String userId = requestBody.get("userId");
        String reportId = requestBody.get("reportId");
        String reportType = requestBody.get("reportType");
        // Generate a random token
        String token = UUID.randomUUID().toString();
        // Associate the token with the reportId temporarily
        tokenStore.put(token, new UserInfo(userId, reportId, reportType));

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }

    @RequestMapping(value = "/retrieve-link-report", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<Map<String, String>> retrieveReportId(
        @RequestParam(value = "token", required = false) String token,
        @RequestBody(required = false) Map<String, String> requestBody) {
        if (requestBody != null && requestBody.containsKey("token")) {
            token = requestBody.get("token");
            System.out.println("token = " + token);
        }
        if (token != null && tokenStore.containsKey(token)) {
            System.out.println("Decoding token");
            UserInfo userInfo = tokenStore.remove(token); // Ensure one-time use by removing the token
            Map<String, String> response = new HashMap<>();
            response.put("userId", userInfo.getUserId());
            response.put("reportId", userInfo.getReportId());
            response.put("reportType", userInfo.getReportType());
            System.out.println("response = " + response);
            return ResponseEntity.ok(response);
        } else {
            // Default response for invalid or missing token
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid or missing token");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    

}


