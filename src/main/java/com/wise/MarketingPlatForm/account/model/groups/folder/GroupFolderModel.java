package com.wise.MarketingPlatForm.account.model.groups.folder;

import java.util.List;

import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.account.model.common.FolderListModel;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupFolderModel {
  GroupMstrEntity group;
  List<FolderListModel> folderList;
}
