package com.wise.MarketingPlatForm.account.model.common;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FolderListModel {
  int fldId;
  boolean authView;
  boolean authPublish;
  boolean authDataItem;
  boolean authExport;
}
