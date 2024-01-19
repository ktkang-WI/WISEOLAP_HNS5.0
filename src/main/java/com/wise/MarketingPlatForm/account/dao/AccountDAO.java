package com.wise.MarketingPlatForm.account.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDataDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDatasetDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDsDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupFolderDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserDataDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserDatasetDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserDsDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserFolderDTO;
import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.account.entity.UserMstrEntity;

@Mapper
public interface AccountDAO {
  public List<UserGroupDTO> selectListGroupData();
  public List<UserDataDTO> selectUserData();
  public List<UserFolderDTO> selectUserFolder();
  public List<GroupDataDTO> selectGroupData();
  public List<GroupFolderDTO> selectGroupFolder();
  public List<GroupDsDTO> selectGroupDs();
  public List<UserDsDTO> selectUserDs();
  public List<GroupDatasetDTO> selectGroupDataset();
  public List<UserDatasetDTO> selectUserDataset();
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
