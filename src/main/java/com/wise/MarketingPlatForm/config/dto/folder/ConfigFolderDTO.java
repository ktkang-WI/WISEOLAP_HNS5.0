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
  boolean authDatasource;
  boolean authDataItem;
  boolean authExport;
}
