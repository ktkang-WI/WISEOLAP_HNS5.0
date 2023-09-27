package com.wise.MarketingPlatForm.dataset.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.vo.DBColumnVO;
import com.wise.MarketingPlatForm.dataset.vo.DBTableVO;
import com.wise.MarketingPlatForm.dataset.vo.DSMstrDTO;

@RestController
@RequestMapping("/dataset")
public class DatasetController {

  private final DatasetService datasetService;

  DatasetController(DatasetService service) {
    datasetService = service;
  }

  @PostMapping(value = "/dataSources")
  public List<DSMstrDTO> getDataSources(@RequestBody Map<String, String> param) {
    String userId = param.getOrDefault("userId", "");
    
    return datasetService.getDataSources(userId);
  }

  @PostMapping(value = "/dbTables")
  public List<DBTableVO> getDBTables(@RequestBody Map<String, String> param) {
    String dsId = param.getOrDefault("dsId", "");
    String search = param.getOrDefault("search", "");

    return datasetService.getDBTables(dsId, search);
  }

  @PostMapping(value = "/dbColumns")
  public List<DBColumnVO> getDBColumns(@RequestBody Map<String, String> param) {
    String dsId = param.getOrDefault("dsId", "");
    String table = param.getOrDefault("table", "");
    String search = param.getOrDefault("search", "");

    return datasetService.getDBColumns(dsId, table, search);
  }
}
