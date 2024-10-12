package com.wise.MarketingPlatForm.config.utils;

import org.springframework.beans.factory.annotation.Autowired;

import com.wise.MarketingPlatForm.account.model.common.ProgModel;
import com.wise.MarketingPlatForm.config.dto.config.AdvancedDTO;
import com.wise.MarketingPlatForm.config.dto.config.GeneralDTO;
import com.wise.MarketingPlatForm.config.dto.config.MenuDTO;
import com.wise.MarketingPlatForm.config.dto.config.ReportDTO;
import com.wise.MarketingPlatForm.config.model.ConfigModel;
import com.wise.MarketingPlatForm.config.service.prog.ConfigProgService;

public class ConfigInitializer {

  private final static ConfigInitializer _instance = new ConfigInitializer();

  public ConfigInitializer() {

  }

  public static ConfigInitializer getInstance() {
    return _instance;
  }
  
  public ConfigModel initConfigModel(ConfigModel configModel) {
    GeneralDTO generalDTO = configModel.getGeneral();
    AdvancedDTO advancedDTO = configModel.getAdvanced();
    MenuDTO menuDTO = configModel.getMenu();
    ReportDTO reportDTO = configModel.getReport();
    ProgModel progModel = configModel.getProg();

    if (generalDTO == null) {
      generalDTO = new GeneralDTO();
    }
    if (advancedDTO == null) {
      advancedDTO = new AdvancedDTO();
    }
    if (menuDTO == null) {
      menuDTO = new MenuDTO();
    }
    if (reportDTO == null) {
      reportDTO = new ReportDTO();
    }
    if (progModel == null) {
      progModel = ConfigProgService.getDefaultProgModel();;
    }

    return ConfigModel.builder()
    .general(generalDTO)
    .advanced(advancedDTO)
    .menu(menuDTO)
    .report(reportDTO)
    .prog(progModel)
    .build();
  }
}
