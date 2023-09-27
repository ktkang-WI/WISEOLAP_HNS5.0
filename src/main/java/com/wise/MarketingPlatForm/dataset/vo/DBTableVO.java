package com.wise.MarketingPlatForm.dataset.vo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DBTableVO {
  String tblNm;
  String tblCpation;
  String parent;
  String id;

  @Builder.Default
  String type="TABLE";

  @Builder.Default
  boolean hasItems = true;

  @Builder.Default
  boolean isDirectory = true;
}
