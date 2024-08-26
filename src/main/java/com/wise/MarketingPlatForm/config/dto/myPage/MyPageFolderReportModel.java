package com.wise.MarketingPlatForm.config.dto.myPage;

import java.util.List;

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
public class MyPageFolderReportModel {
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
  boolean prompt;
  String createdBy;
  List<Integer> ids;
  String datasetXml;
}
