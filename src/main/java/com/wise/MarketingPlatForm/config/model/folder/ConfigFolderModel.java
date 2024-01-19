package com.wise.MarketingPlatForm.config.model.folder;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class ConfigFolderModel {
  int fldId;
  String fldNm;
  int fldLvl;
  int fldParentId;
  String authView;
  String authPublish;
  String authDataItem;
  String authExport;
}
