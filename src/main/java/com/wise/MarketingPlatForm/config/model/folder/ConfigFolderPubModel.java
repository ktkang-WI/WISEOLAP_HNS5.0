package com.wise.MarketingPlatForm.config.model.folder;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class ConfigFolderPubModel {
  int fldId;
  String fldNm;
  int fldParentId;
  boolean authView;
  boolean authPublish;
  boolean authDataItem;
  boolean authExport;
}
