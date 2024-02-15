package com.wise.MarketingPlatForm.config.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class FldMstrEntity {
  int fldId;
  String fldNm;
  int fldLvl;
  int fldParentId;
  int fldOrdinal;
  String fldDesc;
}
