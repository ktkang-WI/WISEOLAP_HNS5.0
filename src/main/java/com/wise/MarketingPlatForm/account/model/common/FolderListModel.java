package com.wise.MarketingPlatForm.account.model.common;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FolderListModel {
  int fldId;
  String authView;
  String authPublish;
  String authDataItem;
  String authExport;
}
