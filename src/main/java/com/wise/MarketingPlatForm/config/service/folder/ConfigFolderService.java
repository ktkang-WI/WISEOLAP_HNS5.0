package com.wise.MarketingPlatForm.config.service.folder;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.config.dao.ConfigDAO;
import com.wise.MarketingPlatForm.config.entity.FldMstrEntity;

@Service
public class ConfigFolderService {
  @Autowired
  ConfigDAO configDao;

  public List<FldMstrEntity> getConfigFolderData() {

    List<FldMstrEntity> configFolderDTO = configDao.selectConfigFolder();
    
    return configFolderDTO;
  };

  public boolean createConfigFolder(FldMstrEntity fldMstrEntity) {
    return configDao.createConfigFolder(fldMstrEntity);
  };

  public boolean patchConfigFolder(FldMstrEntity fldMstrEntity) {
    return configDao.updateConfigFolder(fldMstrEntity);
  };

  public boolean deleteConfigFolder(FldMstrEntity fldMstrEntity) {
    return configDao.deleteConfigFolder(fldMstrEntity);
  };
}
