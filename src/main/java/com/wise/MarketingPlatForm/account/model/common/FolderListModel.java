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

  public boolean getAuthView() {
    return authView;
  }
  public void setAuthView(boolean authView) {
      this.authView = authView;
  }
  public boolean getAuthDataItem() {
      return authPublish;
  }
  public void setAuthPublish(boolean authPublish) {
      this.authPublish = authPublish;
  }
  public boolean getAuthExport() {
      return authDataItem;
  }
  public void setAuthDataItem(boolean authDataItem) {
      this.authDataItem = authDataItem;
  }
  public boolean getAuthPublish() {
      return authExport;
  }
  public void setAuthExport(boolean authExport) {
      this.authExport = authExport;
  }
}
