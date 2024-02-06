package com.wise.MarketingPlatForm.account.model.groups.folder;

import java.util.List;

import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.model.common.FolderListModel;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupFolderModel {
  UserGroupDTO group;
  List<FolderListModel> folderList;
}
