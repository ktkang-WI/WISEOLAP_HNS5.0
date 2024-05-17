package com.wise.MarketingPlatForm.account.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupMstrEntity {
  int grpId;
  String grpNm;
  String grpDesc;
  String grpRunMode;
}
