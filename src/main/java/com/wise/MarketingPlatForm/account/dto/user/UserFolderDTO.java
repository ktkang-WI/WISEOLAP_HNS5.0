package com.wise.MarketingPlatForm.account.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserFolderDTO {
  int userNo;
  String userId;
  String grpNm;
  int fldId;
  String fldNm;
  int fldLvl;
  int fldParentId;
  int fldOrdinal;
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
