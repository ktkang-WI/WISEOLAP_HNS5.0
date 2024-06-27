package com.wise.MarketingPlatForm.account.model.user.folder;

import java.util.List;

import com.wise.MarketingPlatForm.account.model.common.FolderListModel;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserFolderModel {
  Integer userNo;
  List<FolderListModel> fldIds;
}
