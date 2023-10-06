package com.wise.MarketingPlatForm.dataset.vo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DBColumnVO {
  String tblNm;
  String tblCpation;
  String colId;
  String colNm;
  String dataType;
  String length;
  String pkYn;
  @Builder.Default
  String type="COLUMN";
  boolean hasItems;
  boolean isDirectory;
  String id;
}
