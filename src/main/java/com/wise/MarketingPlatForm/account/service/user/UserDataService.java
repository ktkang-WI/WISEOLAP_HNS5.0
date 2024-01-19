package com.wise.MarketingPlatForm.account.service.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.user.UserDataDTO;
import com.wise.MarketingPlatForm.account.entity.UserMstrEntity;
import com.wise.MarketingPlatForm.account.model.user.data.UserDataModel;
import com.wise.MarketingPlatForm.account.service.UserGroupDataService;


@Service
public class UserDataService {

  @Autowired
  private AccountDAO accountDAO;

  @Autowired
  private UserGroupDataService UGDataService;
  
  public List<UserDataModel> getUserData() throws Exception{

    List<UserDataDTO> userGroupDTO = accountDAO.selectUserData();

    List<UserDataModel> userDataModel = generateUserDataObject(userGroupDTO);

    return userDataModel;
  }

  private List<UserDataModel> generateUserDataObject(List<UserDataDTO> userDataDTO) throws Exception{

    List<UserDataModel> result = new ArrayList<>();
    
    for (UserDataDTO userData : userDataDTO) {

      UserMstrEntity user = UserMstrEntity.builder()
        .userNo(userData.getUserNo())
        .userId(userData.getUserId())
        .userNm(userData.getUserNm())
        .grpNm(userData.getGrpNm())
        .build();

      UserDataModel userDataModel = UserDataModel.builder()
        .user(user)
        .dsViews(UGDataService.dataXmlParsing(userData.getDataXml()))
        .build();

      result.add(userDataModel);
    }

    return result;
  }

}


