package com.wise.MarketingPlatForm.account.model.GroupsModel;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupsModel {
  int grpId;
  String grpNm;
  String grpDesc;
  GroupDetailInfoModel grpDetailInfo;
  List<GroupMemberUserModel> grpMemberUser;
  List<GroupMemberUserModel> grpNotMemberUser;
}
