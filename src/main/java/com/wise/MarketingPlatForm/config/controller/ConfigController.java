package com.wise.MarketingPlatForm.config.controller;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.wise.MarketingPlatForm.config.dto.GeneralDTO;
import com.wise.MarketingPlatForm.config.service.GeneralService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "config", description = "환경설정 관련 정보를 처리합니다.")
@RestController
@RequestMapping("/config/general")
public class ConfigController {
  
  private static final Logger logger = LoggerFactory.getLogger(ConfigController.class);

  @Autowired
  private GeneralService generalService;

  @GetMapping
  public GeneralDTO getGeneralData(){
    logger.info("general-data request is successful");
    return generalService.getGeneralData();
  }

  @PatchMapping
  public boolean updateConfig(
      @RequestParam(required = false, defaultValue = "") String mainTitle,
      @RequestParam(required = false, defaultValue = "") String licensesKey,
      @RequestParam(required = false, defaultValue = "") String webUrl,
      @RequestParam(required = false, defaultValue = "") String loginImage,
      @RequestParam(required = false, defaultValue = "") String logo,
      @RequestParam(required = false, defaultValue = "") String spreadJsLicense,
      @RequestParam(required = false, defaultValue = "") String spreadJsDesignLicense,
      @RequestParam(required = false, defaultValue = "") String kakaoMapApiKey,
      @RequestParam(required = false, defaultValue = "") String menuConfig,
      @RequestParam(required = false, defaultValue = "") String adHocLayout
  )  throws SQLException{
    logger.info("general-data request is successful");

    GeneralDTO generalDTO = GeneralDTO.builder()
      .mainTitle(mainTitle)
      .licensesKey(licensesKey)
      .webUrl(webUrl)
      .loginImage(loginImage)
      .logo(logo)
      .spreadJsLicense(spreadJsLicense)
      .spreadJsDesignLicense(spreadJsDesignLicense)
      .kakaoMapApiKey(kakaoMapApiKey)
      .menuConfig(menuConfig)
      .adHocLayout(adHocLayout)
      .build();

    return generalService.updateConfig(generalDTO);
  }
}
