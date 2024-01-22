package com.wise.MarketingPlatForm.config.service.folder;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.config.dao.ConfigDAO;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderDatasetDTO;

@Service
public class ConfigFolderDataSetService {
  
@Autowired
  ConfigDAO configDao;

  public List<ConfigFolderDatasetDTO> getConfigFolderDatasetData() {

    List<ConfigFolderDatasetDTO> configFolderDatasetDTO = configDao.selectConfigFolderDataset();
    
    return configFolderDatasetDTO;
  };

}
