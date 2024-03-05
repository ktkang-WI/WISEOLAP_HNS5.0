package com.wise.MarketingPlatForm.config.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wise.MarketingPlatForm.config.dao.ConfigDAO;
import com.wise.MarketingPlatForm.config.dto.GeneralDTO;
import com.wise.MarketingPlatForm.config.entity.ConfigMstrEntity;
import com.wise.MarketingPlatForm.config.entity.WbConfigMstrEntity;


@Service
public class GeneralService {
  
  @Autowired
  private ConfigDAO configDAO;

  public GeneralDTO getGeneralData() {
    return configDAO.selectGeneralData();
  };

  @Transactional
  public boolean updateConfig(GeneralDTO generalDTO) throws SQLException{

    boolean result = false;

    ConfigMstrEntity configMstrEntity = ConfigMstrEntity.builder()
        .mainTitle(generalDTO.getMainTitle())
        .licensesKey(generalDTO.getLicensesKey())
        .webUrl(generalDTO.getWebUrl())
        .build();

    WbConfigMstrEntity wbConfigMstrEntity = WbConfigMstrEntity.builder()
        .loginImage(generalDTO.getLoginImage())
        .logo(generalDTO.getLogo())
        .spreadJsLicense(generalDTO.getSpreadJsLicense())
        .spreadJsDesignLicense(generalDTO.getSpreadJsDesignLicense())
        .kakaoMapApiKey(generalDTO.getKakaoMapApiKey())
        .build();

        result = configDAO.updateConfig(configMstrEntity);
        result = configDAO.updateWbConfig(wbConfigMstrEntity);
    
    return result;
  }

  public Map<String, String> getSpreadLicense() {
	return configDAO.getSpreadLicense();
  };
}
