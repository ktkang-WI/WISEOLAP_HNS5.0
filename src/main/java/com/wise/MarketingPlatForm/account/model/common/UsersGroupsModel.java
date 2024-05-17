package com.wise.MarketingPlatForm.account.model.common;

import java.util.List;

import com.wise.MarketingPlatForm.account.model.groups.GroupsModel;
import com.wise.MarketingPlatForm.account.model.user.UsersModel;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UsersGroupsModel {
  List<UsersModel> usersFormat;
  List<GroupsModel> groupsFormat;
}
