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
  String regDt; // 게시 일자
  String regUserNm; // 게시자
  String modDt; // 최종 수정 일자
  String modUserNm; // 최종 수정자
  String requester; // 요청자
  String reportTag;
  String reportOrdinal;
  String reportDesc;
  String reportType;
  boolean promptYn;
  boolean maxReportPeriodYn;
  boolean isCube;
}
