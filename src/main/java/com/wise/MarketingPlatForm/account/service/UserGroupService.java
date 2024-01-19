package com.wise.MarketingPlatForm.account.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.model.common.UsersGroupsModel;
import com.wise.MarketingPlatForm.account.model.groups.GroupDetailInfoModel;
import com.wise.MarketingPlatForm.account.model.groups.GroupMemberUserModel;
import com.wise.MarketingPlatForm.account.model.groups.GroupsModel;
import com.wise.MarketingPlatForm.account.model.user.UserDetailInfoModel;
import com.wise.MarketingPlatForm.account.model.user.UsersModel;

@Service
public class UserGroupService {

  @Autowired
  private AccountDAO accountDAO;

  public UsersGroupsModel getUserGroupData() {
    
    List<UserGroupDTO> userGroupDTO = accountDAO.selectListGroupData();

    List<UsersModel> usersFormat = generateUsersObject(userGroupDTO);
    List<GroupsModel> groupsFormat = generateGroupsObject(userGroupDTO);

    UsersGroupsModel usersGroupsFormat = UsersGroupsModel.builder()
      .usersFormat(usersFormat)
      .groupsFormat(groupsFormat)
      .build();

    if (usersGroupsFormat == null) {
        throw new NullPointerException("groupMemberUser is null");
    }

    return usersGroupsFormat;
  };

  private List<GroupsModel> generateGroupsObject(List<UserGroupDTO> userGroups) {
    List<GroupsModel> result = new ArrayList<>();
    List<Integer> groupkeys = new ArrayList<>();
  
    for (UserGroupDTO userGroup : userGroups) {
      if(groupkeys.contains(userGroup.getGrpId())) continue;
      GroupsModel groupMemberUser = generateGroupMemberUser(userGroups, userGroup);
      GroupsModel groupsFormat = GroupsModel.builder()
        .grpId(userGroup.getGrpId())
        .grpNm(userGroup.getGrpNm())
        .grpDesc(userGroup.getGrpDesc())
        .grpDetailInfo(generateGroupDetailInfoObject(userGroup))
        .grpMemberUser(groupMemberUser.getGrpMemberUser())
        .grpNotMemberUser(groupMemberUser.getGrpNotMemberUser())
        .build();
      if (groupsFormat == null) {
        throw new NullPointerException("groupFormat is null");
      }
      result.add(groupsFormat);
      groupkeys.add(groupsFormat.getGrpId());
    }

    return result;
  };

  private GroupsModel generateGroupMemberUser(List<UserGroupDTO> userGroups, UserGroupDTO userGroup) {
    // GroupMemberUser result = new ArrayList<>();
    GroupMemberUserModel groupMemberUser = null;
    List<GroupMemberUserModel> grpMemberUser = new ArrayList<>();
    List<GroupMemberUserModel> grpNotMemberUser = new ArrayList<>();

    for(UserGroupDTO tempUserGroup:userGroups){
      groupMemberUser = GroupMemberUserModel.builder()
      .userNo(tempUserGroup.getUserNo())
      .userId(tempUserGroup.getUserId())
      .userNm(tempUserGroup.getUserNm())
      .build();
      
      if (groupMemberUser == null) {
        throw new NullPointerException("groupMemberUser is null");
      }

      // Group member Users
      if(tempUserGroup.getGrpId() == userGroup.getGrpId()) {
        grpMemberUser.add(groupMemberUser);
      } 
      // Not Group member Users
      else {
        grpNotMemberUser.add(groupMemberUser);
      }
    }

    GroupsModel groupsFormat = GroupsModel.builder()
      .grpMemberUser(grpMemberUser)
      .grpNotMemberUser(grpNotMemberUser)
      .build();

    if (groupsFormat == null) {
        throw new NullPointerException("groupsFormat is null");
    }

    return groupsFormat;
  };



  private GroupDetailInfoModel generateGroupDetailInfoObject(UserGroupDTO userGroup) {
      GroupDetailInfoModel groupDetailInfo = GroupDetailInfoModel.builder()
          .grpNm(userGroup.getGrpNm())
          .grpDesc(userGroup.getGrpDesc())
          .grpRunMode(userGroup.getGrpRunMode())
          .build();

      if (groupDetailInfo == null) {
        throw new NullPointerException("groupDetailInfo is null");
      }
      return groupDetailInfo;
  };


  private List<UsersModel> generateUsersObject(List<UserGroupDTO> userGroups) {
    List<UsersModel> result = new ArrayList<>();
    
    for (UserGroupDTO userGroup : userGroups) {
      UsersModel usersFormat = UsersModel.builder()
        .userId(userGroup.getUserId())
        .userNm(userGroup.getUserNm())
        .userNo(userGroup.getUserNo())
        .grpNm(userGroup.getGrpNm())
        .userDetailInfo(generateUserDetailInfoObject(userGroup))
        .build();
      if (usersFormat == null) {
        throw new NullPointerException("usersFormat is null");
      }
      result.add(usersFormat);
    }
    return result;
  };

  private UserDetailInfoModel generateUserDetailInfoObject(UserGroupDTO userGroup){
    UserDetailInfoModel userDetailInfo = UserDetailInfoModel.builder()
        .userId(userGroup.getUserId())
        .userNm(userGroup.getUserNm())
        .eMail1(userGroup.getEMail1())
        .eMail2(userGroup.getEMail2())
        .telNo(userGroup.getTelNo())
        .grpNm(userGroup.getGrpNm())
        .userRunMode(userGroup.getUserRunMode())
        .grpRunMode(userGroup.getGrpRunMode())
        .userDesc(userGroup.getUserDesc())
        .build();

    if (userDetailInfo == null) {
      throw new NullPointerException("userDetailInfo is null");
    }
    return userDetailInfo;
  };
}
