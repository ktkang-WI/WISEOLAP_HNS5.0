package com.wise.MarketingPlatForm.account.dto.group;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GroupFolderDTO {
  int grpId;
  String grpNm;
  String grpDesc;
  int fldId;
  String fldNm;
  int fldLvl;
  int fldParentId;
  int fldOrdinal;
  String authView;
  String authPublish;
  String authDataItem;
  String authExport;
}
