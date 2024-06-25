package com.wise.MarketingPlatForm.account.service.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserDsDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserDsPutDTO;
import com.wise.MarketingPlatForm.account.entity.UserAuthDsMstrEntity;
import com.wise.MarketingPlatForm.account.model.user.ds.UserDsModel;
import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;

@Service
public class UserDsService {
  @Autowired
  AccountDAO accountDAO;

  public List<UserDsModel> getUserDs() {

    List<UserDsDTO> userDsDTO = accountDAO.selectUserDs();

    if (userDsDTO == null) return null;

    List<UserDsModel> userDsModel = generateUserDsObject(userDsDTO);

    return userDsModel;
  };

  @Transactional
  public boolean putUserDs(List<UserDsPutDTO> userDsPutDTO) {

    List<UserAuthDsMstrEntity> userAuthDsMstr = generateUserAuthDsObject(userDsPutDTO);

    if (userAuthDsMstr == null) return false;

    boolean result = false;
    if (userAuthDsMstr.size() == 0) {
      result = accountDAO.deleteUserDsAll();
    } else {
      result = accountDAO.deleteUserDs(userAuthDsMstr);
      result = accountDAO.putUserDs(userAuthDsMstr);
    }

    return result;
  };

  public List<UserAuthDsMstrEntity> generateUserAuthDsObject(List<UserDsPutDTO> userDsPutDTO) {
    List<UserAuthDsMstrEntity> result = new ArrayList<>();

    for (UserDsPutDTO userDsPut : userDsPutDTO) {
      int userNo = userDsPut.getUserNo();
      List<Integer> dss = userDsPut.getDsIds();
      int dsSize = dss.size();

      if (dsSize == 0) {
        UserAuthDsMstrEntity userAuthDsMstrEntity = UserAuthDsMstrEntity.builder()
          .userNo(userNo)
          .dsId(0)
          .build();

        result.add(userAuthDsMstrEntity);

        continue;
      }

      for (Integer dsId : userDsPut.getDsIds()) {

        UserAuthDsMstrEntity userAuthDsMstrEntity = UserAuthDsMstrEntity.builder()
          .userNo(userNo)
          .dsId(dsId)
          .build();

          result.add(userAuthDsMstrEntity);

      }

    }

    return result;
  }

  public List<UserDsModel> generateUserDsObject(List<UserDsDTO> userDsDTO) {
    
    List<UserDsModel> result = new ArrayList<>();
    List<Integer> dsList = new ArrayList<>();
    List<Integer> userkeys = new ArrayList<>();
    Integer user = 0;
    UserDsModel userDsModel = null;
    int prevUserNo = 0;
    boolean isThereToSave = false;
    
    for (UserDsDTO userDs : userDsDTO) {

      int userNo = userDs.getUserNo();
      boolean lastUserIdNumber = ((prevUserNo != userNo) && prevUserNo != 0);
      boolean isUserContained = userkeys.contains(userNo);

      if (lastUserIdNumber) {
        userDsModel = UserDsModel.builder()
        .userNo(user)
        .dsIds(dsList)
        .build();
        result.add(userDsModel);
        dsList = new ArrayList<>();
      }

      if (!isUserContained) {
        user = userNo;
        userkeys.add(userNo);
      }
  
      dsList.add(userDs.getDsId());

      prevUserNo = userNo;
    }

    isThereToSave = dsList.size() > 0;

    if (isThereToSave) {
      userDsModel = UserDsModel.builder()
        .userNo(user)
        .dsIds(dsList)
        .build();
        result.add(userDsModel);
    }

    return result;
  }
}
