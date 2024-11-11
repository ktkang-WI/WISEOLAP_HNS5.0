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
public class ConfigFolderReportDTO {
  int fldId;
  String fldNm;
  int fldLvl;
  int fldParentId;
  int fldOrdinal;
  int reportId;
  String reportNm;
  String reportSubTitle;
  String userId;
  String regDt; // 게시 일자
  int regUserNo; // 게시자
  String regUserNm;
  String modDt; // 최종 수정 일자
  int modUserNo; // 최종 수정자
  String modUserNm;
  String requester; // 요청자
  String reportTag;
  String reportOrdinal;
  String reportDesc;
  String reportType;
  String datasetXml;
  boolean isCube;
  @Builder.Default
  String promptYn = "N";
  @Builder.Default
  String maxReportPeriodYn = "N";
}
