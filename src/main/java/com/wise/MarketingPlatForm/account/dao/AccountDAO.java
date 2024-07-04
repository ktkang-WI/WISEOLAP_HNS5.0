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
import com.wise.MarketingPlatForm.account.entity.GroupAuthDataMstrEntity;
import com.wise.MarketingPlatForm.account.entity.GroupAuthDatasetMstrEntity;
import com.wise.MarketingPlatForm.account.entity.GroupAuthDsMstrEntity;
import com.wise.MarketingPlatForm.account.entity.GroupAuthReportMstrEntity;
import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.account.entity.UserAuthDataMstrEntity;
import com.wise.MarketingPlatForm.account.entity.UserAuthDatasetMstrEntity;
import com.wise.MarketingPlatForm.account.entity.UserAuthDsMstrEntity;
import com.wise.MarketingPlatForm.account.entity.UserAuthReportMstrEntity;
import com.wise.MarketingPlatForm.account.entity.UserMstrEntity;

@Mapper
public interface AccountDAO {
  public List<UserMstrEntity> selectUserMstr();
  public List<UserDataDTO> selectUserData();
  public List<UserFolderDTO> selectUserFolder();
  public List<UserDsDTO> selectUserDs();
  public List<UserDatasetDTO> selectUserDataset();
  public boolean createUser(UserMstrEntity userMstr);
  public boolean updateUser(UserMstrEntity userMstr);
  public boolean updateUsers(List<UserMstrEntity> userMstrs);
  public boolean updateUserPasswd(UserMstrEntity userMstr);
  public boolean deleteUser(UserMstrEntity userMstr);
  public boolean updateUserDefaultGroup(GroupMstrEntity groupMstr);
  public boolean deleteUserDs(List<UserAuthDsMstrEntity> userAuthDsMstr);
  public boolean putUserDs(List<UserAuthDsMstrEntity> userAuthDsMstr);
  public boolean deleteUserDataset(List<UserAuthDatasetMstrEntity> userAuthDatasetMstr);
  public boolean putUserDataset(List<UserAuthDatasetMstrEntity> userAuthDatasetMstr);
  public boolean deleteUserFolder(List<UserAuthReportMstrEntity> userFolderMstr);
  public boolean putUserFolder(List<UserAuthReportMstrEntity> userFolderMstr);
  public boolean deleteUserData(List<UserAuthDataMstrEntity> userDataMstr);
  public boolean putUserData(List<UserAuthDataMstrEntity> userDataMstr);
  public boolean deleteUserDatasetAll();
  public boolean deleteUserDsAll();
  public boolean deleteUserFolderAll();

  public List<GroupMstrEntity> selectGroupMstr();
  public List<UserGroupDTO> selectListGroupData();
  public List<GroupDataDTO> selectGroupData();
  public List<GroupFolderDTO> selectGroupFolder();
  public List<GroupDsDTO> selectGroupDs();
  public List<GroupDatasetDTO> selectGroupDataset();
  public boolean createGroup(GroupMstrEntity groupMstr);
  public boolean updateGroup(GroupMstrEntity groupMstr);
  public boolean deleteGroup(GroupMstrEntity groupMstr);
  public boolean deleteGroupDs(List<GroupAuthDsMstrEntity> groupAuthDsMstr);
  public boolean putGroupDs(List<GroupAuthDsMstrEntity> groupAuthDsMstr);
  public boolean deleteGroupDataset(List<GroupAuthDatasetMstrEntity> groupAuthDatasetMstr);
  public boolean putGroupDataset(List<GroupAuthDatasetMstrEntity> groupAuthDatasetMstr);
  public boolean deleteGroupFolder(List<GroupAuthReportMstrEntity> groupFolderMstr);
  public boolean putGroupFolder(List<GroupAuthReportMstrEntity> groupFolderMstr);
  public boolean deleteGroupData(List<GroupAuthDataMstrEntity> groupDataMstr);
  public boolean deleteUserDataAll();
  public boolean deleteGroupDataAll();
  public boolean putGroupData(List<GroupAuthDataMstrEntity> groupDataMstr);
  public boolean deleteGroupDsAll();
  public boolean deleteGroupFolderAll();
  public boolean deleteGroupDatasetAll();


}
