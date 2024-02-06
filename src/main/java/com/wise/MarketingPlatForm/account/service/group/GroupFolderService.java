package com.wise.MarketingPlatForm.account.service.group;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupFolderDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupFolderPatchDTO;
import com.wise.MarketingPlatForm.account.entity.GroupAuthReportMstrEntity;
import com.wise.MarketingPlatForm.account.model.common.FolderListModel;
import com.wise.MarketingPlatForm.account.model.groups.folder.GroupFolderModel;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderDTO;
import com.wise.MarketingPlatForm.config.entity.AuthReportMstrEntity;
import com.wise.MarketingPlatForm.config.entity.FldMstrEntity;

@Service
public class GroupFolderService {

  @Autowired
  private AccountDAO accountDAO;

  public List<GroupFolderModel> getGroupFolderData() {

    List<GroupFolderDTO> groupFolderDTO = accountDAO.selectGroupFolder();

    if (groupFolderDTO == null) return null;

    List<GroupFolderModel> groupDataModel = generateGroupFolderObject(groupFolderDTO);

    return groupDataModel;
  };

  public boolean patchGroupFolder(List<GroupFolderPatchDTO> groupFolderPatchDTO) {

    List<GroupAuthReportMstrEntity> groupFolderMstr = generateGroupFolderPatchObject(groupFolderPatchDTO);

    if (groupFolderMstr == null) return false;

    boolean result = false;
  
    result = accountDAO.deleteGroupFolder(groupFolderMstr);
    result = accountDAO.putGroupFolder(groupFolderMstr);

    return result;
  };


  private List<GroupAuthReportMstrEntity> generateGroupFolderPatchObject(List<GroupFolderPatchDTO> groupFolderPatchDTO) {
    List<GroupAuthReportMstrEntity> result = new ArrayList<>();

    for (GroupFolderPatchDTO groupFolder : groupFolderPatchDTO) {
      int grpId = groupFolder.getGrpId();

      for (ConfigFolderDTO configFolderDTO : groupFolder.getFldIds()) {

        GroupAuthReportMstrEntity groupAuthReportMstrEntity = GroupAuthReportMstrEntity.builder()
          .grpId(grpId)
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

  private List<GroupFolderModel> generateGroupFolderObject(List<GroupFolderDTO> groupFolderDTO) {

    List<GroupFolderModel> result = new ArrayList<>();
    List<FolderListModel> folderListMode = new ArrayList<>();
    List<Integer> groupkeys = new ArrayList<>();
    UserGroupDTO group = null;
    GroupFolderModel groupFolderModel = null;
    int prevGroupId = 0;
    boolean isThereToSave = false;

    for (GroupFolderDTO groupData : groupFolderDTO) {

      int grpId = groupData.getGrpId();
      boolean lastGroupIdNumber = ((prevGroupId != grpId) && prevGroupId != 0);
      boolean isGroupContained = groupkeys.contains(grpId);
      
      if (lastGroupIdNumber) {
        groupFolderModel = GroupFolderModel.builder()
        .group(group)
        .folderList(folderListMode)
        .build();
        result.add(groupFolderModel);
        folderListMode = new ArrayList<>();
      }

      if (!isGroupContained) {
        group = UserGroupDTO.builder()
        .grpId(grpId)
        .grpNm(groupData.getGrpNm())
        .grpDesc(groupData.getGrpDesc())
        .build();
        groupkeys.add(grpId);
      }

      FldMstrEntity pubFldMstrEntity = FldMstrEntity.builder()
        .fldId(groupData.getFldId())
        .fldLvl(groupData.getFldLvl())
        .fldNm(groupData.getFldNm())
        .fldOrdinal(groupData.getFldOrdinal())
        .fldParentId(groupData.getFldParentId())
        .build();

      AuthReportMstrEntity authReportMstrEntity = AuthReportMstrEntity.builder()
        .authView(groupData.getAuthView())
        .authDataItem(groupData.getAuthDataItem())
        .authExport(groupData.getAuthExport())
        .authPublish(groupData.getAuthPublish())
        .build();

      FolderListModel folderListModel = FolderListModel.builder()
        .folder(pubFldMstrEntity)
        .auth(authReportMstrEntity)
        .build();
      
      folderListMode.add(folderListModel);

      prevGroupId = grpId;
    }

    isThereToSave = folderListMode.size() > 0;

    if (isThereToSave) {
      groupFolderModel = GroupFolderModel.builder()
        .group(group)
        .folderList(folderListMode)
        .build();
        result.add(groupFolderModel);
    }

    return result;
  }

  
}
