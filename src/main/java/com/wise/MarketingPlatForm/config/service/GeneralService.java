package com.wise.MarketingPlatForm.config.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.config.dao.ConfigDAO;
import com.wise.MarketingPlatForm.config.dto.GeneralDTO;


@Service
public class GeneralService {
  
  @Autowired
  private ConfigDAO configDAO;

  public GeneralDTO getGeneralData() {
    return configDAO.selectGeneralData();
  };
}
