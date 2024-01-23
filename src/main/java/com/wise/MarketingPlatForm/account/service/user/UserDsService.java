package com.wise.MarketingPlatForm.account.service.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserDsDTO;
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

  public List<UserDsModel> generateUserDsObject(List<UserDsDTO> userDsDTO) {
    
    List<UserDsModel> result = new ArrayList<>();
    List<DsMstrEntity> dsList = new ArrayList<>();
    List<Integer> userkeys = new ArrayList<>();
    UserGroupDTO user = null;
    UserDsModel userDsModel = null;
    int prevUserNo = 0;
    boolean isThereToSave = false;
    
    for (UserDsDTO userDs : userDsDTO) {

      int userNo = userDs.getUserNo();
      boolean lastUserIdNumber = ((prevUserNo != userNo) && prevUserNo != 0);
      boolean isUserContained = userkeys.contains(userNo);

      if (lastUserIdNumber) {
        userDsModel = UserDsModel.builder()
        .user(user)
        .ds(dsList)
        .build();
        result.add(userDsModel);
        dsList = new ArrayList<>();
      }

      if (!isUserContained) {
        user = UserGroupDTO.builder()
        .userNo(userDs.getUserNo())
        .userId(userDs.getUserId())
        .userDesc(userDs.getUserDesc())
        .build();
        userkeys.add(userNo);
      }

      DsMstrEntity ds = DsMstrEntity.builder()
        .dsId(userDs.getDsId())
        .dsNm(userDs.getDsNm())
        .dbmsType(userDs.getDbmsType())
        .ownerNm(userDs.getOwnerNm())
        .ip(userDs.getIp())
        .dbNm(userDs.getDbNm())
        .build();


      dsList.add(ds);

      prevUserNo = userNo;
    }

    isThereToSave = dsList.size() > 0;

    if (isThereToSave) {
      userDsModel = UserDsModel.builder()
        .user(user)
        .ds(dsList)
        .build();
        result.add(userDsModel);
    }

    return result;
  }
}
