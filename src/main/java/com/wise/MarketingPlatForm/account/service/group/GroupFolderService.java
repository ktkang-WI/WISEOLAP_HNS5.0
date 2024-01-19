package com.wise.MarketingPlatForm.account.service.group;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.group.GroupFolderDTO;
import com.wise.MarketingPlatForm.account.entity.AuthReportMstrEntity;
import com.wise.MarketingPlatForm.account.entity.FldMstrEntity;
import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.account.model.common.FolderListModel;
import com.wise.MarketingPlatForm.account.model.groups.folder.GroupFolderModel;

@Service
public class GroupFolderService {

  @Autowired
  private AccountDAO accountDAO;

  public List<GroupFolderModel> getGroupFolderData() {

    List<GroupFolderDTO> groupFolderDTO = accountDAO.selectGroupFolder();

    List<GroupFolderModel> groupDataModel = generateGroupFolderObject(groupFolderDTO);

    return groupDataModel;
  };

  private List<GroupFolderModel> generateGroupFolderObject(List<GroupFolderDTO> groupFolderDTO) {

    List<GroupFolderModel> result = new ArrayList<>();
    List<FolderListModel> folderListMode = new ArrayList<>();
    List<Integer> groupkeys = new ArrayList<>();
    GroupMstrEntity group = null;
    GroupFolderModel groupFolderModel = null;
    int prevGrpId = 0;

    for (GroupFolderDTO groupData : groupFolderDTO) {

      int grpId = groupData.getGrpId();

      if ((prevGrpId != grpId) && prevGrpId != 0) {
        groupFolderModel = GroupFolderModel.builder()
        .group(group)
        .folderList(folderListMode)
        .build();
        result.add(groupFolderModel);
        folderListMode = new ArrayList<>();
      }

      if (!groupkeys.contains(grpId)) {
        group = GroupMstrEntity.builder()
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

      prevGrpId = grpId;
    }

    if (folderListMode.size() > 0) {
      groupFolderModel = GroupFolderModel.builder()
        .group(group)
        .folderList(folderListMode)
        .build();
        result.add(groupFolderModel);
    }

    return result;
  }

  
}
