package com.wise.MarketingPlatForm.config.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.config.dto.GeneralDTO;
import com.wise.MarketingPlatForm.config.service.GeneralService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "config", description = "환경설정 관련 정보를 처리합니다.")
@RestController
@RequestMapping("/config")
public class ConfigController {
  
  private static final Logger logger = LoggerFactory.getLogger(ConfigController.class);

  @Autowired
  private GeneralService generalService;

  @GetMapping(value = "/general-data")
  public GeneralDTO getGeneralData(){
    logger.info("general-data request is successful");
    return generalService.getGeneralData();
  }

}
