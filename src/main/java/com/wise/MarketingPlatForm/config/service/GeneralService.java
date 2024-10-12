package com.wise.MarketingPlatForm.config.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.model.common.ProgModel;
import com.wise.MarketingPlatForm.account.model.groups.app.GroupAppModel;
import com.wise.MarketingPlatForm.account.model.user.app.UserAppModel;
import com.wise.MarketingPlatForm.account.service.group.GroupAppService;
import com.wise.MarketingPlatForm.account.service.user.UserAppService;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.model.ConfigModel;
import com.wise.MarketingPlatForm.config.service.prog.ConfigProgService;
import com.wise.MarketingPlatForm.config.utils.ConfigInitializer;


@Service
public class GeneralService {
  
  @Autowired
  JsonFileService jsonFileService;
  @Autowired
  GroupAppService groupAppService;
  @Autowired
  UserAppService userAppService;

  @Value("${meta.config}")
  private String jsonFilePath;

  public ConfigModel getGeneralData(UserDTO user) throws Exception {
    ConfigModel configModel = jsonFileService.readJsonFromFile(ConfigModel.class, jsonFilePath);
    ProgModel progModel = getProgModel(user);
    configModel.setProg(progModel);

    return ConfigInitializer.getInstance().initConfigModel(configModel);
  };

  public ProgModel getProgModel(UserDTO user) throws Exception{
    GroupAppModel groupAppModel = groupAppService.getGroupAppByGrpId(user.getGrpId());
    UserAppModel userAppModel = userAppService.getUserAppByUserNo(user.getUserNo());

    ProgModel groupProgModel = (groupAppModel != null) ? groupAppModel.getProg() : ConfigProgService.getDefaultProgModel();
    ProgModel userProgModel = (userAppModel != null) ? userAppModel.getProg() : ConfigProgService.getDefaultProgModel();

    return ProgModel.merge(groupProgModel, userProgModel);
  }

  public boolean updateConfig(ConfigModel configModel){
    try {
      jsonFileService.writeJsonToFile(configModel, jsonFilePath);
      return true;
    } catch (Exception e) {
        e.printStackTrace();
        return false;
    }
  }
}
