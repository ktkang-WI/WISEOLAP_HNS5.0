package com.wise.MarketingPlatForm.config.controller;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.wise.MarketingPlatForm.config.model.ConfigModel;
import com.wise.MarketingPlatForm.config.service.GeneralService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "config", description = "환경설정 관련 정보를 처리합니다.")
@RestController
@RequestMapping("/config/general")
public class ConfigController {
  
  private static final Logger logger = LoggerFactory.getLogger(ConfigController.class);
  private Gson gson = new Gson();

  @Autowired
  private GeneralService generalService;

  @GetMapping
  public ConfigModel getGeneralData() throws Exception{
    logger.info("general-data request is successful");
    return generalService.getGeneralData();
  }

  @PatchMapping
  public boolean updateConfig(
      @RequestParam(required = false, defaultValue = "{}") String config
  )  throws Exception{
    logger.info("general-data request is successful");
    return generalService.updateConfig(gson.fromJson(config, ConfigModel.class));
  }
}
