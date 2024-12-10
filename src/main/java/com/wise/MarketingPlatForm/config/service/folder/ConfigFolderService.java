package com.wise.MarketingPlatForm.config.service.folder;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

  public boolean reorderFolder(FldMstrEntity fldMstrEntity) {
    return configDao.reorderFolder(fldMstrEntity);
  }

  @Transactional(rollbackFor = Exception.class)
  public boolean reorderFolders(List<FldMstrEntity> folders) {
    try {
      for (FldMstrEntity folder : folders) {
        if (!reorderFolder(folder)) {
          throw new RuntimeException("공용 폴더 reorder 오류 발생: " + folder.getFldId());
        };
      }
  
      return true;
    } catch (Exception e) {
      System.err.println("Exception 발생: " + e.getMessage());
      throw e; 
    }
  };

  public boolean deleteConfigFolder(FldMstrEntity fldMstrEntity) {
    return configDao.deleteConfigFolder(fldMstrEntity);
  };
}
