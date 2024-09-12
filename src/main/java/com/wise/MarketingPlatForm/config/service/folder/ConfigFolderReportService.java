package com.wise.MarketingPlatForm.config.service.folder;

import java.util.ArrayList;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.auth.vo.UserDTO;
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

  public List<ConfigFolderReportDTO> getConfigPrivateFolderReportData(int userNo) {
    // 폴더 
    List<ConfigFolderReportDTO> configFolderDTO = configDao.selectConfigPrivateFolders(userNo);
    // 보고서
    List<ConfigFolderReportDTO> configReportDTO = configDao.selectConfigPrivateFolderReport(userNo);
    List<ConfigFolderReportDTO> resultDTO = configReportDTO;
    
    for (ConfigFolderReportDTO folderDto : configFolderDTO) {
      boolean hasItem = false;
      if (configReportDTO.size() == 0) resultDTO.add(folderDto);
      for (ConfigFolderReportDTO reportDto : configReportDTO) {
        if (folderDto.getFldId() == reportDto.getFldId()) {
          hasItem = true;
          break;
        }
      }
      if (!hasItem) {
        resultDTO.add(folderDto);
      }
    }

    return configReportDTO;
  };
  public List<UserDTO> getUserList() {

    List<UserDTO> configFolderDTO = configDao.selectUserList();
    
    return configFolderDTO;
  };
}
