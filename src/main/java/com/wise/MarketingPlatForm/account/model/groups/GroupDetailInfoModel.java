package com.wise.MarketingPlatForm.account.model.groups;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupDetailInfoModel {
  String grpNm;
  String grpRunMode;
  String grpDesc;
}
