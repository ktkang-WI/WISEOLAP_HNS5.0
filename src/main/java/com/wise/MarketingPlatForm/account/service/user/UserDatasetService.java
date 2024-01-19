package com.wise.MarketingPlatForm.account.service.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDatasetDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserDatasetDTO;
import com.wise.MarketingPlatForm.account.entity.FldMstrEntity;
import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.account.entity.UserMstrEntity;
import com.wise.MarketingPlatForm.account.model.groups.dataset.GroupDatasetModel;
import com.wise.MarketingPlatForm.account.model.user.dataset.UserDatasetModel;
import com.wise.MarketingPlatForm.account.model.user.ds.UserDsModel;

@Service
public class UserDatasetService {

  @Autowired
  private AccountDAO accountDAO;

    public List<UserDatasetModel> getUserDataset() {

    List<UserDatasetDTO> userDatasetDTO = accountDAO.selectUserDataset();

    List<UserDatasetModel> userDatasetModel = generateUserDatasetObject(userDatasetDTO);

    return userDatasetModel;
  };

  public List<UserDatasetModel> generateUserDatasetObject(List<UserDatasetDTO> userDatasetDTO) {

    List<UserDatasetModel> result = new ArrayList<>();
    List<FldMstrEntity> datasetList = new ArrayList<>();
    List<Integer> userkeys = new ArrayList<>();
    UserMstrEntity user = null;
    UserDatasetModel userDatasetModel = null;
    int prevUserNo = 0;
    
    for (UserDatasetDTO userDatasetData : userDatasetDTO) {

      int userNo = userDatasetData.getUserNo();

      if ((prevUserNo != userNo) && prevUserNo != 0) {
        userDatasetModel = UserDatasetModel.builder()
        .user(user)
        .dataset(datasetList)
        .build();
        result.add(userDatasetModel);
        datasetList = new ArrayList<>();
      }

      if (!userkeys.contains(userNo)) {
        user = UserMstrEntity.builder()
        .userNo(userDatasetData.getUserNo())
        .userId(userDatasetData.getUserId())
        .userNm(userDatasetData.getUserNm())
        .grpNm(userDatasetData.getGrpNm())
        .build();
        userkeys.add(userNo);
      }

      FldMstrEntity dataset = FldMstrEntity.builder()
        .fldId(userDatasetData.getFldId())
        .fldNm(userDatasetData.getFldNm())
        .fldParentId(userDatasetData.getParentFldId())
        .build();


      datasetList.add(dataset);

      prevUserNo = userNo;
    }

    if (datasetList.size() > 0) {
      userDatasetModel = UserDatasetModel.builder()
        .user(user)
        .dataset(datasetList)
        .build();
        result.add(userDatasetModel);
    }

    return result;
  }
}
