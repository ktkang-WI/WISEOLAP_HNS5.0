package com.wise.MarketingPlatForm.account.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.account.entity.UserMstrEntity;

@Mapper
public interface AccountDAO {
  public List<UserGroupDTO> selectListGroupData();
  public boolean createUser(UserMstrEntity userMstr);
  public boolean updateUser(UserMstrEntity userMstr);
  public boolean updateUsers(List<UserMstrEntity> userMstrs);
  public boolean updateUserPasswd(UserMstrEntity userMstr);
  public boolean deleteUser(UserMstrEntity userMstr);
  public boolean createGroup(GroupMstrEntity groupMstr);
  public boolean updateGroup(GroupMstrEntity groupMstr);
  public boolean updateUserDefaultGroup(GroupMstrEntity groupMstr);
  public boolean deleteGroup(GroupMstrEntity groupMstr);
}
