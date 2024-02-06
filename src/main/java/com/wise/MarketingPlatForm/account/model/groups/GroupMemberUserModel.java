package com.wise.MarketingPlatForm.account.model.groups;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GroupMemberUserModel {
  int userNo;
  String userId;
  String userNm;
}
