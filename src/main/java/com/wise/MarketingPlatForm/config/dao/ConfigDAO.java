package com.wise.MarketingPlatForm.config.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.config.dto.GeneralDTO;
import com.wise.MarketingPlatForm.config.dto.UserGroupDTO;

@Mapper
public interface ConfigDAO {
  public GeneralDTO selectGeneralData();
  public List<UserGroupDTO> selectListGroupData();
}
