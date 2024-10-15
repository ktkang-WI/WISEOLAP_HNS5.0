package com.wise.MarketingPlatForm.config.dto.myPage;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MyPageFolderReportDTO {
  int userNo;
  int id;
  String name;
  int fldLvl;
  int ordinal;
  int fldParentId;
  String type;
  String subtitle;
  String tag;
  String desc;
  String query;
  String createdDate;
  @Builder.Default
  String prompt = "N";
  @Builder.Default
  String maxReportPeriodYn = "N";
  String createdBy;
  List<Integer> ids;
  String datasetXml;
}
