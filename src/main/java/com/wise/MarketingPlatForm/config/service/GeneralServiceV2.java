package com.wise.MarketingPlatForm.config.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.config.dto.GeneralDTO;

@Service
public class GeneralServiceV2 {
  
  @Autowired
  ConfigJsonFileService configJsonFileService;

  public GeneralDTO getConfig() {

  };

}
