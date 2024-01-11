package com.wise.MarketingPlatForm.config.model.UserGroupFormat;

import java.util.List;

import com.wise.MarketingPlatForm.config.model.UserGroupFormat.GroupsModel.GroupsModel;
import com.wise.MarketingPlatForm.config.model.UserGroupFormat.UsersModel.UsersFormatModel;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UsersGroupsModel {
  List<UsersFormatModel> usersFormat;
  List<GroupsModel> groupsFormat;
}
