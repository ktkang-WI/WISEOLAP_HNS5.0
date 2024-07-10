package com.wise.MarketingPlatForm.config.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.config.dto.config.AdvancedDTO;
import com.wise.MarketingPlatForm.config.dto.config.GeneralDTO;
import com.wise.MarketingPlatForm.config.dto.config.MenuDTO;
import com.wise.MarketingPlatForm.config.dto.config.ReportDTO;
import com.wise.MarketingPlatForm.config.model.ConfigModel;
import com.wise.MarketingPlatForm.config.utils.ConfigInitializer;


@Service
public class GeneralService {
  
  @Autowired
  JsonFileService jsonFileService;

  @Value("${meta.config}")
  private String jsonFilePath;

  public ConfigModel getGeneralData() throws Exception {
    ConfigModel configModel = jsonFileService.readJsonFromFile(ConfigModel.class, jsonFilePath);
    return ConfigInitializer.getInstance().initConfigModel(configModel);
  };

  public boolean updateConfig(ConfigModel configModel){
    try {
      jsonFileService.writeJsonToFile(configModel, jsonFilePath);
      return true;
    } catch (Exception e) {
        e.printStackTrace();
        return false;
    }
  }
}
