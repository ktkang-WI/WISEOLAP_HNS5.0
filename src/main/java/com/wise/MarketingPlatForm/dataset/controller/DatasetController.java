package com.wise.MarketingPlatForm.dataset.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.vo.DSMstrDTO;

@RestController
@RequestMapping("/dataset")
public class DatasetController {

  private final DatasetService datasetService;

  DatasetController(DatasetService service) {
    datasetService = service;
  }

  @PostMapping(value = "/dataSourceList")
  public List<DSMstrDTO> getDataSourceList(@RequestBody Map<String, String> param)
  {
    String userId = param.get("userId");
    String dsType = param.get("dsType");
    
    return datasetService.getDataSourceList(userId, dsType);
  }
}
