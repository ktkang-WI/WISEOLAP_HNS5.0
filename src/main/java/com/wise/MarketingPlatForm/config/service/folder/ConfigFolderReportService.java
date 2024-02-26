package com.wise.MarketingPlatForm.config.service.folder;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.config.dao.ConfigDAO;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderReportDTO;

@Service
public class ConfigFolderReportService {

  @Autowired
  ConfigDAO configDao;

  public List<ConfigFolderReportDTO> getConfigFolderReportData() {

    List<ConfigFolderReportDTO> configFolderDTO = configDao.selectConfigFolderReport();
    
    return configFolderDTO;
  };
}
