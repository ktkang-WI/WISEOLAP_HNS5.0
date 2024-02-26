package com.wise.MarketingPlatForm.dataset.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.wise.MarketingPlatForm.dataset.domain.cube.vo.CubeInfoDTO;
import com.wise.MarketingPlatForm.dataset.domain.cube.vo.CubeMstrDTO;
import com.wise.MarketingPlatForm.dataset.domain.parameter.vo.ListParameterDTO;
import com.wise.MarketingPlatForm.dataset.domain.parameter.vo.ListParameterResultVO;
import com.wise.MarketingPlatForm.dataset.service.CubeService;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.vo.CubeTableColumn;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.dataset.vo.DsViewDTO;
import com.wise.MarketingPlatForm.dataset.vo.UserUploadMstrDTO;
import com.wise.MarketingPlatForm.dataset.vo.DsViewTableDTO;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "dataset", description = "dataset과 관련된 요청을 처리합니다.")
@RestController
@RequestMapping("/dataset")
public class DatasetController {

    private final DatasetService datasetService;
    private final CubeService cubeService;

    DatasetController(DatasetService datasetService, CubeService cubeService) {
        this.datasetService = datasetService;
        this.cubeService = cubeService;
    }

    @Operation(summary = "get datasources", description = "DS_MSTR 테이블에 있는 DataSource들의 정보를 가져옵니다.")
    @Parameters({
            @Parameter(name = "userId", description = "사용자 아이디", example = "admin", required = true)
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"userId\": \"admin\"}")
    }))
    @PostMapping(value = "/data-sources")
    public List<DsMstrDTO> getDataSources(@RequestBody Map<String, String> param) {
        String userId = param.getOrDefault("userId", "");

        return datasetService.getDataSources(userId);
    }

    @Operation(summary = "get datasource", description = "DS_MSTR 테이블에 있는 DataSource의 정보를 가져옵니다.")
    @Parameters({
            @Parameter(name = "dsId", description = "dataset 아이디", example = "2143", required = true)
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"dsId\": \"2143\"}")
    }))
    @PostMapping(value = "/data-source")
    public DsMstrDTO getDataSource(@RequestBody Map<String, String> param) {
        String dsId = param.getOrDefault("dsId", "");

        return datasetService.getDataSource(Integer.parseInt(dsId));
    }


    @Operation(summary = "get database tables", description = "지정한 DS_ID에 해당하는 데이터베이스의 테이블 정보를 가져옵니다. TreeView 양식에 맞춰져 있습니다.")
    @Parameters({
            @Parameter(name = "dsId", description = "DS_ID", example = "3000", required = true),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"dsId\": \"2101\"}")
    }))
    @PostMapping(value = "/db-tables")
    public List<Map<String, Object>> getDBTables(@RequestBody Map<String, String> param) {
        String dsId = param.getOrDefault("dsId", "");

        return datasetService.getDBTables(dsId);
    }

    @Operation(summary = "get dsview database tables", description = "지정한 DS_ID에 해당하는 데이터 원본 뷰의 설정된 테이블 정보를 가져옵니다. TreeView 양식에 맞춰져 있습니다.")
    @Parameters({
            @Parameter(name = "dsId", description = "DS_ID", example = "3000", required = true),
            @Parameter(name = "dsViewId", description = "DS_VIEW_ID", example = "3000", required = true),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"dsId\": \"2101\", \"dsViewId\": \"6260\"}")
    }))
    @PostMapping(value = "/dsview-db-tables")
    public List<DsViewTableDTO> getDsViewDBTables(@RequestBody Map<String, String> param) {
        String dsId = param.getOrDefault("dsId", "");
        String dsViewId = param.getOrDefault("dsViewId", "");

        return datasetService.getDsViewDBTables(dsId, dsViewId);
    }

    @Operation(summary = "get database columns", description = "지정한 DS_ID와 테이블에 해당하는 컬럼 정보를 가져옵니다. TreeView 양식에 맞춰져 있습니다.")
    @Parameters({
            @Parameter(name = "dsId", description = "DS_ID", example = "3000", required = true),
            @Parameter(name = "table", description = "테이블 명", example = "TEST", required = true),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"dsId\": \"2101\", \"table\": \"F_교육기관\"}")
    }))
    @PostMapping(value = "/db-columns")
    public List<Map<String, Object>> getDBColumns(@RequestBody Map<String, String> param) {
        String dsId = param.getOrDefault("dsId", "");
        String table = param.getOrDefault("table", "");

        return datasetService.getDBColumns(dsId, table);
    }

    @Operation(summary = "get data source views", description = "유저의 권한에 맞는 데이터 원본 뷰를 반환합니다.")
    @Parameters({
            @Parameter(name = "userId", description = "user id", example = "admin", required = true),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"userId\": \"admin\"}")
    }))
    @PostMapping(value = "/ds-views")
    public List<DsViewDTO> getDsViews(@RequestBody Map<String, String> param) {
        String userId = param.getOrDefault("userId", "");

        return datasetService.getDsViews(userId);
    }

    @Operation(summary = "get cubes", description = "전체 또는 dsViewId에 해당하는 cube list를 반환합니다.")
    @Parameters({
            @Parameter(name = "dsViewId", description = "data source view id", example = "3295"),
            @Parameter(name = "userId", description = "user id", example = "admin", required = true),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"dsViewId\": \"5181\", \"userId\": \"admin\"}")
    }))

    @PostMapping(value = "/cubes")
    public List<CubeMstrDTO> getCubes(@RequestBody Map<String, String> param) {
        String dsViewId = param.getOrDefault("dsViewId", "");
        String userId = param.getOrDefault("userId", "");

        return cubeService.getCubes(dsViewId, userId);
    }

    @Operation(summary = "get cube", description = "전체 또는 dsViewId에 해당하는 cube list를 반환합니다.")
    @Parameters({
            @Parameter(name = "cubeId", description = "cube id", example = "3295"),
            @Parameter(name = "userId", description = "user id", example = "admin", required = true),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"cubeId\": \"5181\", \"userId\": \"admin\"}")
    }))
    @PostMapping(value = "/cube")
    public CubeInfoDTO getCube(@RequestBody Map<String, String> param) {
        String cubeId = param.getOrDefault("cubeId", "");
        String userId = param.getOrDefault("userId", "");

        return cubeService.getCube(cubeId, userId);
    }

    @Operation(summary = "mart connection sample code", description = "mart db연결 sample code")
    @PostMapping(value = "/mart-sample")
    public MartResultDTO martSelectList() {
        return datasetService.martSelectList();
    }

    @Operation(summary = "queryDataset tables", description = "쿼리 직접입력 데이터 항목 가져옴.")
    @Parameters({
            @Parameter(name = "dsId", description = "DS id", example = "2703"),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"dsId\": \"2703\"}")
    }))
    @PostMapping(value = "/query-dataset-tables")
    public Map<String, MartResultDTO> getTables(@RequestBody Map<String, Integer> datasource) {
        int dsId = datasource.get("dsId");

        return datasetService.getQueryDatasetTable(dsId);
    }

    @Operation(summary = "queryDataset validate", description = "쿼리 유효성 검사 및 데이터 가져옴")
    @Parameters({
            @Parameter(name = "query", description = "query contents", example = "select * from DEMO_01_D_공공_고객"),
            @Parameter(name = "dsId", description = "DS id", example = "2703"),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"query\": \"select * from DEMO_01_D_공공_고객\", \"dsId\": \"2703\"}")
    }))
    @PostMapping(value = "/query-dataset-datas")
    public MartResultDTO getValidate(@RequestBody Map<String, String> datasource) {
        String query = datasource.get("query");
        int dsId = Integer.parseInt(datasource.get("dsId"));
        String parameterStr = datasource.getOrDefault("parameter", "");

        Gson gson = new Gson();

        List<com.wise.MarketingPlatForm.report.domain.data.data.Parameter> parameters = gson.fromJson(parameterStr,
                new TypeToken<ArrayList<com.wise.MarketingPlatForm.report.domain.data.data.Parameter>>() {
                }.getType());
                
        return datasetService.getQueryData(dsId, query, parameters);
    }
    
    @Operation(summary = "dataset Data", description = "dataset data 불러오기")
    @Parameters({
            @Parameter(name = "query", description = "query contents", example = "select * from DEMO_01_D_공공_고객"),
            @Parameter(name = "dsId", description = "DS id", example = "2703"),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"query\": \"select * from DEMO_01_D_공공_고객\", \"dsId\": \"2703\"}")
    }))
    @PostMapping(value = "/query-dataset-all-datas")
    public MartResultDTO getQueryDatas(@RequestBody Map<String, String> datasource) {
        String query = datasource.get("query");
        int dsId = Integer.parseInt(datasource.get("dsId"));
        String parameterStr = datasource.getOrDefault("parameter", "");

        Gson gson = new Gson();

        List<com.wise.MarketingPlatForm.report.domain.data.data.Parameter> parameters = gson.fromJson(parameterStr,
                new TypeToken<ArrayList<com.wise.MarketingPlatForm.report.domain.data.data.Parameter>>() {
                }.getType());
                
        return datasetService.getQueryDatas(dsId, query, parameters);
    }

    @Operation(summary = "get List Parameter Items", description = "리스트형 매개변수의 리스트 목록 및 defautlValue를 조회함.")
    @Parameters({
            @Parameter(required = true, name = "dataSource", description = "데이터 원본(테이블 또는 쿼리)", example = "SELECT 자동차명, 자동차코드 FROM D_자동차종류 WHERE 생산회사코드 IN (@AAA)"),
            @Parameter(required = true, name = "dataSourceType", description = "데이터 원본 타입(QUERY 또는 TABLE)", example = "QUERY"),
            @Parameter(required = true, name = "dataType", description = "아이템의 데이터 타입", example = "STRING"),
            @Parameter(required = true, name = "defaultValue", description = "기본값", example = "[\"K3\", \"\"]"),
            @Parameter(required = true, name = "defaultValueUseSql", description = "기본값이 쿼리를 사용하는지 여부", example = "false"),
            @Parameter(required = true, name = "dsId", description = "데이터 원본 아이디", example = "2143"),
            @Parameter(required = true, name = "itemCaption", description = "리스트 아이템의 캡션", example = "자동차명"),
            @Parameter(required = true, name = "itemKey", description = "리스트 아이템의 키", example = "자동차코드"),
            @Parameter(name = "sortBy", description = "정렬 기준 항목", example = "자동차명"),
            @Parameter(name = "sortOrder", description = "정렬 방법", example = "ASX"),
            @Parameter(name = "linkageValue", description = "연계 필터 목록", example = "[]")
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\r\n" + //
                    "  \"dsId\": 2143,\r\n" + //
                    "  \"dataSourceType\": \"QUERY\",\r\n" + //
                    "  \"dataSource\": \"SELECT 자동차명, 자동차코드 FROM D_자동차종류 WHERE 생산회사코드 IN (@AAA)\",\r\n" + //
                    "  \"dataType\": \"STRING\",\r\n" + //
                    "  \"linkageValues\": [\r\n" + //
                    "    {\r\n" + //
                    "      \"name\": \"@AAA\",\r\n" + //
                    "      \"value\": [\r\n" + //
                    "        \"기아\",\r\n" + //
                    "        \"\"\r\n" + //
                    "      ]\r\n" + //
                    "    }\r\n" + //
                    "  ],\r\n" + //
                    "  \"itemKey\": \"자동차코드\",\r\n" + //
                    "  \"itemCaption\": \"자동차명\",\r\n" + //
                    "  \"sortBy\": \"\",\r\n" + //
                    "  \"sortOrder\": \"ASC\",\r\n" + //
                    "  \"operation\": \"IN\",\r\n" + //
                    "  \"defaultValue\": [\r\n" + //
                    "    \"[All]\",\r\n" + //
                    "    \"\"\r\n" + //
                    "  ],\r\n" + //
                    "  \"defaultValueUseSql\": false\r\n" + //
                    "}")
    }))
    @PostMapping(value = "/param-list-items")
    public ListParameterResultVO getListParameterItems(@RequestBody Map<String, String> param) {
        ListParameterDTO listParameterDTO = ListParameterDTO.fromMap(param);
        return datasetService.getListParameterItems(listParameterDTO);
    }

    @Operation(summary = "get Paramter Default Values", description = "기본값에 쿼리를 사용하는 매개변수를 조회합니다.")
    @Parameters({
            @Parameter(name = "dsId", description = "ds Id", example = "select * from DEMO_01_D_공공_고객"),
            @Parameter(name = "defaultValue", description = "Query List", example = "[\"select 자동차명 FROM D_자동차종류 WHERE 생산회사코드 IN (\'01\')\"]"),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"query\": \"select * from DEMO_01_D_공공_고객\", \"dsId\": \"2703\"}")
    }))
    @PostMapping(value = "/param-default-value")
    public List<String> getDefaultvalues(@RequestBody Map<String, String> param) {
        Gson gson = new Gson();
        int dsId = Integer.parseInt(param.get("dsId"));
        List<String> defaultValue = gson.fromJson(String.valueOf(param.get("defaultValue")),
            new TypeToken<ArrayList<String>>() {
            }.getType());

        return datasetService.getDefaultValues(dsId, defaultValue);
    }

    @Operation(summary = "get Cube Column Information", description = "필터 생성을 위한 차원 정보를 불러온다.")
    @Parameters({
            @Parameter(name = "cubeId", description = "cube id", example = "3295"),
            @Parameter(name = "userId", description = "user id", example = "admin", required = true),
            @Parameter(name = "uniqueName", description = "unique name", example = "[D_자동차].[자동차명]", required = true),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"cubeId\": \"5181\", \"userId\": \"admin\", \"uniqueName\": \"[D_자동차].[자동차명]\"}")
    }))
    @PostMapping(value = "/cube-column")
    public CubeTableColumn getCubeColumn(@RequestBody Map<String, String> param) {
        String cubeId = param.getOrDefault("cubeId", "");
        String userId = param.getOrDefault("userId", "");
        String uniqueName = param.getOrDefault("uniqueName", "");

        return cubeService.getCubeColumInformation(cubeId, userId, uniqueName);
    }

    @Operation(summary = "get SingleTable DataSet Query", description = "단일테이블 쿼리 생성용.")
    @Parameters({
            @Parameter(name = "dsId", description = "데이터 원본 아이디"),
            @Parameter(name = "columnList", description = "단일테이블 컬럼 목록"),
            @Parameter(name = "parameter", description = "필터 정보"),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"dsId\": \"5181\", \"columnList\": \"[{\"TBL_CAPTION\":\"F_교육기관\",\"PK_YN\":null,\"LENGTH\":\"255\",\"COL_CAPTION\":\"COL행정구\",\"ID\":\"[F_교육기관].[COL행정구]\",\"COL_ID\":\"7\",\"TBL_NM\":\"F_교육기관\",\"DATA_TYPE\":\"VARCHAR2\",\"COL_NM\":\"COL행정구\",\"PARENT_ID\":\"F_교육기관\",\"TYPE\":\"DIM\",\"columnTypeName\":\"varchar2\",\"columnName\":\"COL행정구\",\"order\":0,\"visibility\":true}]\", \"parameter\": \"\"}")
    }))
    @PostMapping(value = "/query-single-datas")
    public String getSingleTableQuery(@RequestBody Map<String, String> params) {
        Gson gson = new Gson();
        int dsId = Integer.parseInt(params.get("dsId"));
        String parameterStr = params.getOrDefault("parameter", "");
        
        List<com.wise.MarketingPlatForm.report.domain.data.data.Parameter> parameters = gson.fromJson(parameterStr,
            new TypeToken<ArrayList<com.wise.MarketingPlatForm.report.domain.data.data.Parameter>>() {
            }.getType());
        
        String columnStr = params.getOrDefault("columnList", "");

        List<Map<String, Object>> columnList = gson.fromJson(columnStr,
            new TypeToken<ArrayList<Map<String, Object>>>() {
            }.getType());
        
        String singleTableQuery = datasetService.generateSingleTableQuery(dsId, columnList, parameters);

        return singleTableQuery;
    }
	@Operation(summary = "get database upload tables", description = "지정한 DS_ID에 해당하는 데이터베이스에 사용자가 업로드한 테이블 정보를 가져옵니다. TreeView 양식에 맞춰져 있습니다.")
    @Parameters({
            @Parameter(name = "dsId", description = "DS_ID", example = "3000", required = true),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = {
            @ExampleObject(name = "example", value = "{\"dsId\": \"2101\"}")
    }))
    @PostMapping(value = "/db-upload-tables")
    public List<UserUploadMstrDTO> getDBUploadTables(@RequestBody Map<String, String> param) {
        
        int dsId = Integer.parseInt(param.get("dsId"));

        return datasetService.getDBUploadTables(dsId);
	}
}
