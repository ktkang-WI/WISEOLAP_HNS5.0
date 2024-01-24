package com.wise.MarketingPlatForm.report.controller;

import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.Dataset;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.PagingOption;
import com.wise.MarketingPlatForm.report.domain.data.data.TopBottomInfo;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
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

import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


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
    public List<ReportResult> getAdHocItemData(HttpServletResponse response, @RequestBody Map<String, String> param)
            throws Exception {
        Gson gson = new Gson();
        String dimensionsStr = param.getOrDefault("dimension", "[]");
        String measuresStr = param.getOrDefault("measure", "[]");
        String sortByItemsStr = param.getOrDefault("sortByItem", "[]");
        String datasetStr = param.get("dataset");
        String parameterStr = param.getOrDefault("parameter", "[]");
        String userId = param.get("userId");
        String pagingOptionStr = param.getOrDefault("pagingOption", "");
        String topBottomInfoStr = param.get("topBottomInfo");

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
        Dataset dataset = gson.fromJson(datasetStr, Dataset.class);
        PagingOption pagingOption = gson.fromJson(pagingOptionStr, PagingOption.class);
        boolean removeNullData = param.getOrDefault("removeNullData", "false").equals("true");

        TopBottomInfo topBottomInfo = gson.fromJson(topBottomInfoStr, TopBottomInfo.class);

        DataAggregation dataAggreagtion = DataAggregation.builder()
                .dataset(dataset)
                .measures(measures)
                .dimensions(dimensions)
                .sortByItems(sortByItems)
                .userId(userId)
                .parameters(parameters)
                .removeNullData(removeNullData)
                .pagingOption(pagingOption)
                .topBottomInfo(topBottomInfo)
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
	public ReportMstrEntity addReport(@RequestBody Map<String, String> param) {
    	Gson gson = new Gson();
    	ReportMstrEntity reportMstr = gson.fromJson(gson.toJson(param), ReportMstrEntity.class);
        String reportType = param.getOrDefault("reportType", "");
        reportMstr.setReportType(reportType);
        return reportService.addReport(reportMstr);

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
    
    private int processColumns(XSSFSheet sheet, List<Map<String, Object>> columns, int startCol, int startRow) {
        int currentCol = startCol;
        XSSFRow headerRow = sheet.getRow(startRow);
        if (headerRow == null) {
            headerRow = sheet.createRow(startRow);
        }
        headerRow.createCell(currentCol).setCellValue("GRAND_TOTAL");

        int maxDepth = 0;
        for (Map<String, Object> column : columns) {
            int depth = getDepth(column, 0);
            maxDepth = Math.max(maxDepth, depth);
        }

        // Merge "GRAND_TOTAL" vertically
        sheet.addMergedRegion(new CellRangeAddress(startRow, startRow + maxDepth, currentCol, currentCol));
        currentCol++;

        for (Map<String, Object> column : columns) {
            String value = (String) column.get("value");
            List<Map<String, Object>> children = (List<Map<String, Object>>) column.get("children");
            if (!children.isEmpty() && children.size() > 1) {
                headerRow.createCell(currentCol).setCellValue(value + " TOTAL");
                sheet.addMergedRegion(new CellRangeAddress(startRow, startRow + maxDepth, currentCol, currentCol));
                currentCol++;
            }
            headerRow.createCell(currentCol).setCellValue(value);
            if (children.size() > 1) {
                sheet.addMergedRegion(new CellRangeAddress(startRow, startRow, currentCol, currentCol + children.size() - 1));
            }
            if (!children.isEmpty()) {
                fillChildren(sheet, children, startRow + 1, currentCol);
            }
            currentCol += children.size() > 0 ? children.size() : 1;
        }
        return currentCol;
    }

    private void fillChildren(XSSFSheet sheet, List<Map<String, Object>> children, int row, int col) {
        XSSFRow childrenRow = sheet.getRow(row);
        if (childrenRow == null) {
            childrenRow = sheet.createRow(row);
        }
        for (int i = 0; i < children.size(); i++) {
            childrenRow.createCell(col + i).setCellValue(children.get(i).get("value").toString());
            List<Map<String, Object>> subChildren = (List<Map<String, Object>>) children.get(i).get("children");
            if (subChildren != null && !subChildren.isEmpty()) {
                fillChildren(sheet, subChildren, row + 1, col + i);
            }
        }
    }
    private int getDepth(Map<String, Object> node, int currentDepth) {
        List<Map<String, Object>> children = (List<Map<String, Object>>) node.get("children");
        if (children.isEmpty()) {
            return currentDepth;
        }
        int maxDepth = currentDepth;
        for (Map<String, Object> child : children) {
            int depth = getDepth(child, currentDepth + 1);
            maxDepth = Math.max(maxDepth, depth);
        }
        return maxDepth;
    }
    
    private int getColumnDepth(List<Map<String, Object>> columns) {
        int maxDepth = 0;
        for (Map<String, Object> column : columns) {
            int depth = getDepth(column, 0);
            maxDepth = Math.max(maxDepth, depth);
        }
        return maxDepth;
    }

    private int processRows(XSSFSheet sheet, List<Map<String, Object>> rows, List<Map<String, Object>> columns, int startRow, int startCol) {
        int currentRow = startRow;
        int maxDepth = 0;
        for (Map<String, Object> row : rows) {
            int depth = getDepth(row, 0);
            maxDepth = Math.max(maxDepth, depth);
        }
        int maxColumnDepth = getColumnDepth(columns);
        // Create a new cell for "grand_total" value and merge horizontally
        XSSFRow emptyRow = sheet.createRow(currentRow);
        XSSFCell emptyCell = emptyRow.createCell(startCol);
        emptyCell.setCellValue("");
        sheet.addMergedRegion(new CellRangeAddress(currentRow, currentRow + maxColumnDepth, startCol, startCol + maxDepth));       
        currentRow += maxColumnDepth;
        currentRow++;
        XSSFRow grandTotalRow = sheet.createRow(currentRow);
        XSSFCell grandTotalCell = grandTotalRow.createCell(startCol);
        grandTotalCell.setCellValue("GRAND_TOTAL");
        sheet.addMergedRegion(new CellRangeAddress(currentRow, currentRow, startCol, startCol + maxDepth));
        currentRow++;

        for (Map<String, Object> row : rows) {
            String rowValue = (String) row.get("value");

            // Create a new cell for rows.value + "total" and merge horizontally
            XSSFRow totalRow = sheet.createRow(currentRow);
            XSSFCell totalCell = totalRow.createCell(startCol);
            totalCell.setCellValue(rowValue + " TOTAL");
            sheet.addMergedRegion(new CellRangeAddress(currentRow, currentRow, startCol, startCol + maxDepth));
            // Create a new cell for value
            XSSFRow valueRow = sheet.createRow(currentRow + 1);
            XSSFCell valueCell = valueRow.createCell(startCol);
            valueCell.setCellValue(rowValue);

            List<Map<String, Object>> children = (List<Map<String, Object>>) row.get("children");

            // Check if there are children and they have values
            if (children != null && !children.isEmpty()) {
                int childRow = currentRow + 1; // Start from the row below valueRow
                int childCol = startCol + 1; // Start from the cell to the right

                for (Map<String, Object> child : children) {
                    String childValue = (String) child.get("value");

                    // Create a new cell for the child value
                    XSSFRow childDataRow = sheet.getRow(childRow);
                    if (childDataRow == null) {
                        childDataRow = sheet.createRow(childRow);
                    }
                    XSSFCell childCell = childDataRow.createCell(childCol);
                    childCell.setCellValue(childValue);

                    // Move to the next row
                    childRow++;
                }

                // Merge cells vertically for the number of children
                sheet.addMergedRegion(new CellRangeAddress(currentRow + 1, currentRow + children.size(), startCol, startCol));

                // Update currentRow to the next available row after children
                currentRow = childRow;
            } else {
                // If no children, move to the next available row
                currentRow += 2; // 2 because we have added rows.value + "total" and value
            }
        }

        return currentRow;
    }
    
    private int getRowDepth(List<Map<String, Object>> rows) {
        int maxDepth = 0;
        for (Map<String, Object> row : rows) {
            int depth = getDepth(row, 0);
            maxDepth = Math.max(maxDepth, depth);
        }
        return maxDepth;
    }

    @PostMapping(value = "/download-report-all")
    public void downloadReportAll(@RequestBody Map<String, Object> requestData, HttpServletResponse response) {
        String reportName = ((Map<String, String>) requestData.get("dataSource")).get("reportNm");
        String reportType = ((Map<String, String>) requestData.get("dataSource")).get("reportType");
        List<Map<String, Object>> items = (List<Map<String, Object>>) requestData.get("items");
        XSSFWorkbook workbook = new XSSFWorkbook();
        for (Map<String, Object> item : items) {
            String itemType = (String) item.get("type");
            Map<String, Object> meta = (Map<String, Object>) item.get("meta");
            String sheetName = (String) meta.get("name");
            
            if ("pivot".equals(itemType) || "grid".equals(itemType)) {
                XSSFSheet sheet = workbook.createSheet(sheetName);

                Map<String, Object> mart = (Map<String, Object>) item.get("mart");              
                Map<String, Object> dataSourceConfig = (Map<String, Object>) mart.get("dataSourceConfig");
                Map<String, Object> dataSourceConfigData = (Map<String, Object>) dataSourceConfig.get("_data");
                List<Map<String, Object>> rows = (List<Map<String, Object>>) dataSourceConfigData.get("rows");
                List<Map<String, Object>> columns = (List<Map<String, Object>>) dataSourceConfigData.get("columns");
                List<Map<String, Object>> values = (List<Map<String, Object>>) dataSourceConfigData.get("values");
                
                int maxRowDepth = getRowDepth(rows);
                 
                processRows(sheet, rows, columns, 1, 0);
                //processColumns(sheet, columns, maxRowDepth +1, 1);


            } else if ("chart".equals(itemType)) {
                // Handle chart type, e.g., convert chart data to an image and insert it into a sheet
            }
        }
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + "new_Report" + ".xlsx\"");
        // Write the workbook to the response output stream
        try (OutputStream out = response.getOutputStream()) {
            workbook.write(out);
            // Properly close the workbook
            workbook.close();
        } catch (Exception e) {
            // Handle exceptions appropriately
            e.printStackTrace();
        }
    }
//  sheet.createRow(0).createCell(1).setCellValue("Grand_Total");
//  sheet.createRow(1).createCell(0).setCellValue("Grand_Total");
//  int rowIndex = 2; // Start from the third row in Excel (row index 2)
//  for (Map<String, Object> row : rows) {
//      XSSFRow excelRow = sheet.createRow(rowIndex++);
//      // Assume 'index' and 'value' are keys in your row data map
//      int index = (Integer) row.get("index");
//      String value = (String) row.get("value");
//      excelRow.createCell(0).setCellValue(value);
//  }
//  int columnIndex = 2; // Start from the third column in Excel (column index 2)
//  XSSFRow headerRow = sheet.getRow(0); // Assuming the first row is your header
//  for (Map<String, Object> column : columns) {
//      // Assume 'index' and 'value' are keys in your column data map
//      int index = (Integer) column.get("index");
//      String value = (String) column.get("value");
//      headerRow.createCell(columnIndex++).setCellValue(value);
//  }    
//  for (int r = 0; r < values.size(); r++) {
//  List<List<Object>> valueRowList = (List<List<Object>>) values.get(r); // Cast each element to a List of Lists
//  XSSFRow excelRow = sheet.getRow(r + 1); // Starting from row 2 in Excel (index 1)
//  if (excelRow == null) {
//      excelRow = sheet.createRow(r + 1); // Create a row if it doesn't exist
//  }
//
//  int cellIndex = 1; // Starting from column B in Excel (index 1)
//  for (List<Object> cellValueList : valueRowList) {
//      // Assuming each sublist has only one element
//      if (!cellValueList.isEmpty()) {
//          Object cellValue = cellValueList.get(0); // Get the first element of the sublist
//          excelRow.createCell(cellIndex++).setCellValue(cellValue.toString());
//      }
//  }
//}
}
    

