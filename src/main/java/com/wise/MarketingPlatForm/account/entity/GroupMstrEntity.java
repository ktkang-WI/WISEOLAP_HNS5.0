package com.wise.MarketingPlatForm.account.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GroupMstrEntity {
  int grpId;
  String grpNm;
  String grpDesc;
  String grpRunMode;
}
