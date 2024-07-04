package com.wise.MarketingPlatForm.config.service.folder;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.config.dao.ConfigDAO;
import com.wise.MarketingPlatForm.config.model.folder.ConfigFolderPubModel;

@Service
public class configFolderPubService {
  @Autowired
  ConfigDAO configDao;

  public List<ConfigFolderPubModel> getConfigFolderPubData() {

    List<ConfigFolderPubModel> configFolderPubModel = configDao.selectConfigPubFolder();
    
    return configFolderPubModel;
  };
}
