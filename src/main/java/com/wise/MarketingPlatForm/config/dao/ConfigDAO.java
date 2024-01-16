package com.wise.MarketingPlatForm.config.dao;

import org.apache.ibatis.annotations.Mapper;
import com.wise.MarketingPlatForm.config.dto.GeneralDTO;
import com.wise.MarketingPlatForm.config.entity.ConfigMstrEntity;
import com.wise.MarketingPlatForm.config.entity.WbConfigMstrEntity;

@Mapper
public interface ConfigDAO {
  public GeneralDTO selectGeneralData();
  public boolean updateConfig(ConfigMstrEntity configMstr);
  public boolean updateWbConfig(WbConfigMstrEntity wbConfigMstr);
}
