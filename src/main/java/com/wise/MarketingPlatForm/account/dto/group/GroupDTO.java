package com.wise.MarketingPlatForm.account.dto.group;

import java.util.List;

import com.wise.MarketingPlatForm.account.model.groups.GroupMemberUserModel;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GroupDTO {
  int grpId;
  String grpNm;
  String grpDesc;
  String grpRunMode;
  List<GroupMemberUserModel> grpMemberUser;
}
