package com.wise.MarketingPlatForm.config.model.folder;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class ConfigFolderDatasetModel {
  int fldId;
  String fldNm;
  int parentFldId;
  int fldOridinal;
}
