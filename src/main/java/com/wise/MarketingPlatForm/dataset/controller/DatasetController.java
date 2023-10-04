package com.wise.MarketingPlatForm.dataset.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.vo.DBColumnVO;
import com.wise.MarketingPlatForm.dataset.vo.DBTableVO;
import com.wise.MarketingPlatForm.dataset.vo.DSMstrDTO;

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

  DatasetController(DatasetService service) {
    datasetService = service;
  }

  @Operation(
    summary = "get datasources",
    description = "DS_MSTR 테이블에 있는 DataSource들의 정보를 가져옵니다.")
  @Parameters({
    @Parameter(name = "userId", description = "사용자 아이디", example = "admin", required = true)
  })
  @io.swagger.v3.oas.annotations.parameters.RequestBody(
    content = @Content(
      examples = {
        @ExampleObject(name = "example", value = "{\"userId\": \"admin\"}")
      }
    )
  )
  @PostMapping(value = "/dataSources")
  public List<DSMstrDTO> getDataSources(@RequestBody Map<String, String> param) {
    String userId = param.getOrDefault("userId", "");
    
    return datasetService.getDataSources(userId);
  }


  @Operation(
    summary = "get database tables",
    description = "지정한 DS_ID에 해당하는 데이터베이스의 테이블 정보를 가져옵니다. TreeView 양식에 맞춰져 있습니다.")
  @Parameters({
    @Parameter(name = "dsId", description = "DS_ID", example = "3000", required = true),
    @Parameter(name = "search", description = "필터링 할 키워드(선택)", example = "")
  })
  @io.swagger.v3.oas.annotations.parameters.RequestBody(
    content = @Content(
      examples = {
        @ExampleObject(name = "example", value = "{\"dsId\": \"2101\"}")
      }
    )
  )
  @PostMapping(value = "/dbTables")
  public List<DBTableVO> getDBTables(@RequestBody Map<String, String> param) {
    String dsId = param.getOrDefault("dsId", "");
    String search = param.getOrDefault("search", "");

    return datasetService.getDBTables(dsId, search);
  }

  @Operation(
    summary = "get database columns",
    description = "지정한 DS_ID와 테이블에 해당하는 컬럼 정보를 가져옵니다. TreeView 양식에 맞춰져 있습니다.")
  @Parameters({
    @Parameter(name = "dsId", description = "DS_ID", example = "3000", required = true),
    @Parameter(name = "table", description = "테이블 명", example = "TEST", required = true),
    @Parameter(name = "search", description = "필터링 할 키워드(선택)", example = "")
  })
  @io.swagger.v3.oas.annotations.parameters.RequestBody(
    content = @Content(
      examples = {
        @ExampleObject(name = "example", value = "{\"dsId\": \"2101\", \"table\": \"F_교육기관\"}")
      }
    )
  )
  @PostMapping(value = "/dbColumns")
  public List<DBColumnVO> getDBColumns(@RequestBody Map<String, String> param) {
    String dsId = param.getOrDefault("dsId", "");
    String table = param.getOrDefault("table", "");
    String search = param.getOrDefault("search", "");

    return datasetService.getDBColumns(dsId, table, search);
  }
}
