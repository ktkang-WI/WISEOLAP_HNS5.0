package com.wise.MarketingPlatForm.account.service.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserFolderDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserFolderPatchDTO;
import com.wise.MarketingPlatForm.account.entity.UserAuthDatasetMstrEntity;
import com.wise.MarketingPlatForm.account.entity.UserAuthReportMstrEntity;
import com.wise.MarketingPlatForm.account.model.common.FolderListModel;
import com.wise.MarketingPlatForm.account.model.user.folder.UserFolderModel;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderDTO;
import com.wise.MarketingPlatForm.config.entity.AuthReportMstrEntity;
import com.wise.MarketingPlatForm.config.entity.FldMstrEntity;

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
  public boolean patchUserFolder(List<UserFolderPatchDTO> userFolderPatchDTO) {

    List<UserAuthReportMstrEntity> userFolderMstr = generateUserFolderPatchObject(userFolderPatchDTO);

    if (userFolderMstr == null) return false;

    boolean result = false;

    result = accountDAO.deleteUserFolder(userFolderMstr);
    result = accountDAO.putUserFolder(userFolderMstr);

    return result;
  };

  private List<UserAuthReportMstrEntity> generateUserFolderPatchObject(List<UserFolderPatchDTO> userFolderPatchDTO) {
    List<UserAuthReportMstrEntity> result = new ArrayList<>();

    for (UserFolderPatchDTO userFolder : userFolderPatchDTO) {
      int userNo = userFolder.getUserNo();
      List<ConfigFolderDTO> fldIds = userFolder.getFldIds();
      int fldsSize = fldIds.size();
  
      if (fldsSize == 0) {
        UserAuthReportMstrEntity userAuthDatasetMstrEntity = UserAuthReportMstrEntity.builder()
          .userNo(userNo)
          .fldId(0)
          .authDataItem("N")
          .authExport("N")
          .authPublish("N")
          .authView("N")
          .build();
          result.add(userAuthDatasetMstrEntity);

        continue;
      }

      for (ConfigFolderDTO configFolderDTO : userFolder.getFldIds()) {

        UserAuthReportMstrEntity groupAuthReportMstrEntity = UserAuthReportMstrEntity.builder()
          .userNo(userNo)
          .fldId(configFolderDTO.getFldId())
          .authDataItem(configFolderDTO.getAuthDataItem())
          .authExport(configFolderDTO.getAuthExport())
          .authPublish(configFolderDTO.getAuthPublish())
          .authView(configFolderDTO.getAuthView())
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
