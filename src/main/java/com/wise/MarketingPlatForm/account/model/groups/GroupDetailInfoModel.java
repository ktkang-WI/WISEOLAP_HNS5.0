package com.wise.MarketingPlatForm.account.model.groups;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupDetailInfoModel {
  int grpId;
  String grpNm;
  String grpRunMode;
  String grpDesc;
}
