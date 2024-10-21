package com.wise.MarketingPlatForm.account.service.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.user.UserFolderDTO;
import com.wise.MarketingPlatForm.account.entity.UserAuthReportMstrEntity;
import com.wise.MarketingPlatForm.account.model.common.FolderListModel;
import com.wise.MarketingPlatForm.account.model.user.folder.UserFolderModel;

@Service
public class UserFolderService {

  @Autowired
  private AccountDAO accountDAO;

  public List<UserFolderModel> getUserFolderData() {

    List<UserFolderDTO> userFolderDTO = accountDAO.selectUserFolder();

    if (userFolderDTO == null) return null;

    List<UserFolderModel> userDataModel = generateUserFolderObject(userFolderDTO);

    return userDataModel;
  };


  @Transactional
  public boolean patchUserFolder(List<UserFolderModel> userFolderPatchDTO) {

    List<UserAuthReportMstrEntity> userFolderMstr = generateUserFolderPatchObject(userFolderPatchDTO);

    if (userFolderMstr == null) return false;

    boolean result = false;
    // if (userFolderMstr.size() == 0) {
    //   result = accountDAO.deleteUserFolderAll();
    // } else {
      result = accountDAO.deleteUserFolder(userFolderMstr);
      result = accountDAO.putUserFolder(userFolderMstr);
    // }

    return result;
  };

  private List<UserAuthReportMstrEntity> generateUserFolderPatchObject(List<UserFolderModel> userFolderPatchDTO) {
    List<UserAuthReportMstrEntity> result = new ArrayList<>();

    for (UserFolderModel userFolder : userFolderPatchDTO) {
      int userNo = userFolder.getUserNo();
      List<FolderListModel> fldIds = userFolder.getFldIds();
      int fldsSize = fldIds.size();
  
      if (fldsSize == 0) {
        UserAuthReportMstrEntity userAuthDatasetMstrEntity = UserAuthReportMstrEntity.builder()
          .userNo(userNo)
          .fldId(0)
          .authDataItem(false)
          .authExport(false)
          .authPublish(false)
          .authDatasource(false)
          .authView(false)
          .build();
          result.add(userAuthDatasetMstrEntity);

        continue;
      }

      for (FolderListModel configFolderDTO : userFolder.getFldIds()) {

        UserAuthReportMstrEntity groupAuthReportMstrEntity = UserAuthReportMstrEntity.builder()
          .userNo(userNo)
          .fldId(configFolderDTO.getFldId())
          .authDataItem(configFolderDTO.isAuthDataItem())
          .authExport(configFolderDTO.isAuthExport())
          .authPublish(configFolderDTO.isAuthPublish())
          .authDatasource(configFolderDTO.isAuthDatasource())
          .authView(configFolderDTO.isAuthView())
          .build();

          result.add(groupAuthReportMstrEntity);

      }

    }
    return result;
  };


  private List<UserFolderModel> generateUserFolderObject(List<UserFolderDTO> userFolderDTO) {

    List<UserFolderModel> result = new ArrayList<>();
    List<FolderListModel> folderListMode = new ArrayList<>();
    List<Integer> userkeys = new ArrayList<>();
    int user = 0;
    UserFolderModel userFolderModel = null;
    int prevUserNo = 0;
    boolean isThereToSave = false;

    for (UserFolderDTO userData : userFolderDTO) {

      int userNo = userData.getUserNo();
      boolean lastUserIdNumber = ((prevUserNo != userNo) && prevUserNo != 0);
      boolean isUserContained = userkeys.contains(userNo);

      if (lastUserIdNumber) {
        userFolderModel = UserFolderModel.builder()
          .userNo(user)
          .fldIds(folderListMode)
          .build();
        result.add(userFolderModel);
        folderListMode = new ArrayList<>();
      }

      if (!isUserContained) {
        user = userNo;
        userkeys.add(userNo);
      }

      FolderListModel folderListModel = FolderListModel.builder()
        .fldId(userData.getFldId())
        .authView(userData.isAuthView())
        .authDataItem(userData.isAuthDataItem())
        .authExport(userData.isAuthExport())
        .authPublish(userData.isAuthPublish())
        .authDatasource(userData.isAuthDatasource())
        .build();
  
      folderListMode.add(folderListModel);

      prevUserNo = userNo;
    }

    isThereToSave = folderListMode.size() > 0;

    if (isThereToSave) {
      userFolderModel = UserFolderModel.builder()
        .userNo(user)
        .fldIds(folderListMode)
        .build();
        result.add(userFolderModel);
    }

    return result;
  }
}
