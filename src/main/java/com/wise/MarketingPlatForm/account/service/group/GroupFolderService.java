package com.wise.MarketingPlatForm.account.service.group;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.group.GroupFolderDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupFolderPatchDTO;
import com.wise.MarketingPlatForm.account.entity.GroupAuthReportMstrEntity;
import com.wise.MarketingPlatForm.account.model.common.FolderListModel;
import com.wise.MarketingPlatForm.account.model.groups.folder.GroupFolderModel;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderDTO;

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

  @Transactional
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
      List<ConfigFolderDTO> fldIds = groupFolder.getFldIds();
      int fldsSize = fldIds.size();

      if (fldsSize == 0) {
        GroupAuthReportMstrEntity groupAuthReportMstrEntity = GroupAuthReportMstrEntity.builder()
          .grpId(grpId)
          .fldId(0)
          .authDataItem(false)
          .authExport(false)
          .authPublish(false)
          .authView(false)
          .build();

          result.add(groupAuthReportMstrEntity);

        continue;
      }

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
    int group = 0;
    GroupFolderModel groupFolderModel = null;
    int prevGroupId = 0;
    boolean isThereToSave = false;

    for (GroupFolderDTO groupData : groupFolderDTO) {

      int grpId = groupData.getGrpId();
      boolean lastGroupIdNumber = ((prevGroupId != grpId) && prevGroupId != 0);
      boolean isGroupContained = groupkeys.contains(grpId);

      if (lastGroupIdNumber) {
        groupFolderModel = GroupFolderModel.builder()
        .grpId(group)
        .fldIds(folderListMode)
        .build();
        result.add(groupFolderModel);
        folderListMode = new ArrayList<>();
      }

      if (!isGroupContained) {
        group = grpId;
        groupkeys.add(grpId);
      }

      FolderListModel folderListModel = FolderListModel.builder()
        .fldId(groupData.getFldId())
        .authView(groupData.getAuthView())
        .authDataItem(groupData.getAuthDataItem())
        .authExport(groupData.getAuthExport())
        .authPublish(groupData.getAuthPublish())
        .build();

      folderListMode.add(folderListModel);

      prevGroupId = grpId;
    }

    isThereToSave = folderListMode.size() > 0;

    if (isThereToSave) {
      groupFolderModel = GroupFolderModel.builder()
        .grpId(group)
        .fldIds(folderListMode)
        .build();
        result.add(groupFolderModel);
    }

    return result;
  }


}
