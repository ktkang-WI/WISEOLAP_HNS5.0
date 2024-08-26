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
public class ConfigFolderReportModel {
  int fldId;
  String fldNm;
  int fldLvl;
  int fldParentId;
  int fldOrdinal;
  int reportId;
  String reportNm;
  String reportSubTitle;
  String userId;
  String regDt;
  String reportTag;
  String reportOrdinal;
  String reportDesc;
  String reportType;
  boolean promptYn;
}
