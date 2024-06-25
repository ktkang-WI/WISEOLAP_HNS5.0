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
}
