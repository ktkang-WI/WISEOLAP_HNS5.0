package com.wise.MarketingPlatForm.config.service.folder;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.config.dao.ConfigDAO;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderDTO;

@Service
public class ConfigFolderGroupService {
  
  @Autowired
  ConfigDAO configDao;

  public List<ConfigFolderDTO> getConfigFolderGroupData() {

    List<ConfigFolderDTO> configFolderDTO = configDao.selectConfigFolderGroup();
    
    return configFolderDTO;
  };

}
