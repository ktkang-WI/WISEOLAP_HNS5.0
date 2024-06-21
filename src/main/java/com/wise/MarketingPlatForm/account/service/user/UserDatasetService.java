package com.wise.MarketingPlatForm.account.service.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.user.UserDatasetDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserDatasetPutDTO;
import com.wise.MarketingPlatForm.account.entity.UserAuthDatasetMstrEntity;
import com.wise.MarketingPlatForm.account.model.user.dataset.UserDatasetModel;

@Service
public class UserDatasetService {

  @Autowired
  private AccountDAO accountDAO;

    public List<UserDatasetModel> getUserDataset() {

    List<UserDatasetDTO> userDatasetDTO = accountDAO.selectUserDataset();

    if (userDatasetDTO == null) return null;

    List<UserDatasetModel> userDatasetModel = generateUserDatasetObject(userDatasetDTO);

    return userDatasetModel;
  };

  @Transactional
  public boolean putUserDataset(List<UserDatasetPutDTO> userDatasetPutDTO) {

    List<UserAuthDatasetMstrEntity> userAuthDatasetMstr = generateUserAuthDatasetObject(userDatasetPutDTO);

    if (userAuthDatasetMstr == null) return false;

    boolean result = false;
  
    result = accountDAO.deleteUserDataset(userAuthDatasetMstr);
    result = accountDAO.putUserDataset(userAuthDatasetMstr);

    return result;
  };
  
    public List<UserAuthDatasetMstrEntity> generateUserAuthDatasetObject(List<UserDatasetPutDTO> userDatasetPutDTO) {
    List<UserAuthDatasetMstrEntity> result = new ArrayList<>();

    for (UserDatasetPutDTO userDatasetPut : userDatasetPutDTO) {
      int userNo = userDatasetPut.getUserNo();
      List<Integer> flds = userDatasetPut.getFldId();
      int fldsSize = flds.size();

      if (fldsSize == 0) {
        UserAuthDatasetMstrEntity userAuthDatasetMstrEntity = UserAuthDatasetMstrEntity.builder()
          .userNo(userNo)
          .fldId(0)
          .build();
          result.add(userAuthDatasetMstrEntity);

        continue;
      }

      for (Integer fldId : userDatasetPut.getFldId()) {

        UserAuthDatasetMstrEntity userAuthDatasetMstrEntity = UserAuthDatasetMstrEntity.builder()
          .userNo(userNo)
          .fldId(fldId)
          .build();

          result.add(userAuthDatasetMstrEntity);

      }

    }

    return result;
  }

  public List<UserDatasetModel> generateUserDatasetObject(List<UserDatasetDTO> userDatasetDTO) {

    List<UserDatasetModel> result = new ArrayList<>();
    List<Integer> datasetList = new ArrayList<>();
    List<Integer> userkeys = new ArrayList<>();
    Integer user = 0;
    UserDatasetModel userDatasetModel = null;
    int prevUserNo = 0;
    boolean isThereToSave = false;
    
    for (UserDatasetDTO userDatasetData : userDatasetDTO) {

      int userNo = userDatasetData.getUserNo();
      boolean lastUserIdNumber = ((prevUserNo != userNo) && prevUserNo != 0);
      boolean isUserContained = userkeys.contains(userNo);

      if (lastUserIdNumber) {
        userDatasetModel = UserDatasetModel.builder()
        .userNo(user)
        .fldId(datasetList)
        .build();
        result.add(userDatasetModel);
        datasetList = new ArrayList<>();
      }

      if (!isUserContained) {
        user = userDatasetData.getUserNo();
        userkeys.add(userNo);
      }
    
      datasetList.add(userDatasetData.getFldId());

      prevUserNo = userNo;
    }

    isThereToSave = datasetList.size() > 0;

    if (isThereToSave) {
      userDatasetModel = UserDatasetModel.builder()
        .userNo(user)
        .fldId(datasetList)
        .build();
        result.add(userDatasetModel);
    }

    return result;
  }
}
