package com.wise.MarketingPlatForm.account.model;

import java.util.List;

import com.wise.MarketingPlatForm.account.model.GroupsModel.GroupsModel;
import com.wise.MarketingPlatForm.account.model.UsersModel.UsersFormatModel;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UsersGroupsModel {
  List<UsersFormatModel> usersFormat;
  List<GroupsModel> groupsFormat;
}
