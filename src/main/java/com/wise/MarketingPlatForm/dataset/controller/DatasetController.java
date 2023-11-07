package com.wise.MarketingPlatForm.dataset.controller;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.wise.MarketingPlatForm.dataset.domain.cube.vo.CubeInfoDTO;
import com.wise.MarketingPlatForm.dataset.domain.cube.vo.CubeMstrDTO;
import com.wise.MarketingPlatForm.dataset.service.CubeService;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.vo.DbColumnVO;
import com.wise.MarketingPlatForm.dataset.vo.DbTableVO;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.dataset.vo.DsViewDTO;
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
  @PostMapping(value = "/data-sources")
  public List<DsMstrDTO> getDataSources(@RequestBody Map<String, String> param) {
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
  @PostMapping(value = "/db-tables")
  public List<DbTableVO> getDBTables(@RequestBody Map<String, String> param) {
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
  @PostMapping(value = "/db-columns")
  public List<DbColumnVO> getDBColumns(@RequestBody Map<String, String> param) {
    String dsId = param.getOrDefault("dsId", "");
    String table = param.getOrDefault("table", "");
    String search = param.getOrDefault("search", "");

    return datasetService.getDBColumns(dsId, table, search);
  }

  @Operation(
    summary = "get data source views",
    description = "유저의 권한에 맞는 데이터 원본 뷰를 반환합니다.")
  @Parameters({
    @Parameter(name = "userId", description = "user id", example = "admin", required = true),
  })
  @io.swagger.v3.oas.annotations.parameters.RequestBody(
    content = @Content(
      examples = {
        @ExampleObject(name = "example", value = "{\"userId\": \"admin\"}")
      }
    )
  )
  @PostMapping(value = "/ds-views")
  public List<DsViewDTO> getDsViews(@RequestBody Map<String, String> param) {
    String userId = param.getOrDefault("userId", "");

    return datasetService.getDsViews(userId);
  }

  @Operation(
    summary = "get cubes",
    description = "전체 또는 dsViewId에 해당하는 cube list를 반환합니다.")
  @Parameters({
    @Parameter(name = "dsViewId", description = "data source view id", example = "3295"),
    @Parameter(name = "userId", description = "user id", example = "admin", required = true),
  })
  @io.swagger.v3.oas.annotations.parameters.RequestBody(
    content = @Content(
      examples = {
        @ExampleObject(name = "example", value = "{\"dsViewId\": \"5181\", \"userId\": \"admin\"}")
      }
    )
  )
 
  @PostMapping(value = "/cubes")
  public List<CubeMstrDTO> getCubes(@RequestBody Map<String, String> param) {
    String dsViewId = param.getOrDefault("dsViewId", "");
    String userId = param.getOrDefault("userId", "");

    return cubeService.getCubes(dsViewId, userId);
  }

  @Operation(
    summary = "get cube",
    description = "전체 또는 dsViewId에 해당하는 cube list를 반환합니다.")
  @Parameters({
    @Parameter(name = "cubeId", description = "cube id", example = "3295"),
    @Parameter(name = "userId", description = "user id", example = "admin", required = true),
  })
  @io.swagger.v3.oas.annotations.parameters.RequestBody(
    content = @Content(
      examples = {
        @ExampleObject(name = "example", value = "{\"cubeId\": \"5181\", \"userId\": \"admin\"}")
      }
    )
  )
  @PostMapping(value = "/cube")
  public CubeInfoDTO getCube(@RequestBody Map<String, String> param) {
    String cubeId = param.getOrDefault("cubeId", "");
    String userId = param.getOrDefault("userId", "");

    return cubeService.getCube(cubeId, userId);
  }

  @Operation(
    summary = "mart connection sample code",
    description = "mart db연결 sample code")
  @PostMapping(value = "/mart-sample")
    public MartResultDTO martSelectList() {
    return datasetService.martSelectList();
  }
  
}
