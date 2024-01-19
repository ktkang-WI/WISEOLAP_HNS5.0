package com.wise.MarketingPlatForm.account.service.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserFolderDTO;
import com.wise.MarketingPlatForm.account.entity.AuthReportMstrEntity;
import com.wise.MarketingPlatForm.account.entity.FldMstrEntity;
import com.wise.MarketingPlatForm.account.entity.UserMstrEntity;
import com.wise.MarketingPlatForm.account.model.common.FolderListModel;
import com.wise.MarketingPlatForm.account.model.user.folder.UserFolderModel;

@Service
public class UserFolderService {
  
  @Autowired
  private AccountDAO accountDAO;

  public List<UserFolderModel> getUserFolderData() {

    List<UserFolderDTO> userFolderDTO = accountDAO.selectUserFolder();

    List<UserFolderModel> userDataModel = generateUserFolderObject(userFolderDTO);

    return userDataModel;
  };

  private List<UserFolderModel> generateUserFolderObject(List<UserFolderDTO> userFolderDTO) {

    List<UserFolderModel> result = new ArrayList<>();
    List<FolderListModel> folderListMode = new ArrayList<>();
    List<Integer> userkeys = new ArrayList<>();
    UserGroupDTO user = null;
    UserFolderModel userFolderModel = null;
    int prevUserNo = 0;
    boolean isThereToSave = false;

    for (UserFolderDTO userData : userFolderDTO) {

      int userNo = userData.getUserNo();
      boolean lastUserIdNumber = ((prevUserNo != userNo) && prevUserNo != 0);
      boolean isUserContained = userkeys.contains(userNo);

      if (lastUserIdNumber) {
        userFolderModel = UserFolderModel.builder()
          .user(user)
          .folderList(folderListMode)
          .build();
        result.add(userFolderModel);
        folderListMode = new ArrayList<>();
      }

      if (!isUserContained) {
        user = UserGroupDTO.builder()
          .userNo(userData.getUserNo())
          .userId(userData.getUserId())
          .grpNm(userData.getGrpNm())
          .build();
          userkeys.add(userNo);
      }

      FldMstrEntity pubFldMstrEntity = FldMstrEntity.builder()
        .fldId(userData.getFldId())
        .fldLvl(userData.getFldLvl())
        .fldNm(userData.getFldNm())
        .fldOrdinal(userData.getFldOrdinal())
        .fldParentId(userData.getFldParentId())
        .build();

      AuthReportMstrEntity authReportMstrEntity = AuthReportMstrEntity.builder()
        .authView(userData.getAuthView())
        .authDataItem(userData.getAuthDataItem())
        .authExport(userData.getAuthExport())
        .authPublish(userData.getAuthPublish())
        .build();

      FolderListModel folderListModel = FolderListModel.builder()
        .folder(pubFldMstrEntity)
        .auth(authReportMstrEntity)
        .build();
      
      folderListMode.add(folderListModel);

      prevUserNo = userNo;
    }

    isThereToSave = folderListMode.size() > 0;

    if (isThereToSave) {
      userFolderModel = UserFolderModel.builder()
        .user(user)
        .folderList(folderListMode)
        .build();
        result.add(userFolderModel);
    }

    return result;
  }
}
