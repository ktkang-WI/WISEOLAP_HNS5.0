package com.wise.MarketingPlatForm.config.dto.folder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfigFolderDTO {
  int grpId;
  int userNo;
  int fldId;
  String fldNm;
  int fldLvl;
  int fldParentId;
  int fldOridinal;
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
