package com.wise.MarketingPlatForm.config.dto.folder;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class ConfigFolderDTO {
  int grpId;
  int fldId;
  String fldNm;
  int fldLvl;
  int fldParentId;
  int fldOridinal;
  String authView;
  String authPublish;
  String authDataItem;
  String authExport;
}
