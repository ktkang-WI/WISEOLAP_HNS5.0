package com.wise.MarketingPlatForm.config.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.config.dto.GeneralDTO;
import com.wise.MarketingPlatForm.config.service.GeneralServiceV2;

@RestController
@RequestMapping("/config/general2")
public class ConfigControllerV2 {
  private static final Logger logger = LoggerFactory.getLogger(ConfigControllerV2.class);

  @Autowired
  private GeneralServiceV2 generalService;
  
  @GetMapping
  public ResponseEntity<RestAPIVO> getConfig() {
    return RestAPIVO.okResponse(true);
  }

  @PatchMapping
  public ResponseEntity<RestAPIVO> updateConfig(
    @RequestParam(required = true, defaultValue = "{}") GeneralDTO generalDTO
  ) 
  {

    return RestAPIVO.okResponse(true);
  }
}
