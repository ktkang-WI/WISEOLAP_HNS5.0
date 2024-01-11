package com.wise.MarketingPlatForm.config.model.UserGroupFormat.GroupsModel;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupMemberUserModel {
  int userNo;
  String userId;
  String userNm;
}
