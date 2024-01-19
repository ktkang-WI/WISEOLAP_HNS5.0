package com.wise.MarketingPlatForm.account.service.group;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDTO;
import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.account.entity.UserMstrEntity;
import com.wise.MarketingPlatForm.account.model.groups.GroupMemberUserModel;

@Service
public class GroupService {

    @Autowired
    private AccountDAO accountDAO;

    @Transactional
    public boolean createGroup(GroupDTO groupDTO) throws SQLException{
      boolean result = false;
      List<UserMstrEntity> userMstr = new ArrayList<>();
      int grpId = 0;

      GroupMstrEntity groupMstrEntity = GroupMstrEntity.builder()
        .grpNm(groupDTO.getGrpNm())
        .grpRunMode(groupDTO.getGrpRunMode())
        .grpDesc(groupDTO.getGrpDesc())
        .build();

      result = accountDAO.createGroup(groupMstrEntity);

      if (!result) throw new SQLException("그룹이 업데이트 되지 않았습니다.");

      grpId = groupMstrEntity.getGrpId();

      for (GroupMemberUserModel groupMemberUser : groupDTO.getGrpMemberUser())
      {
        UserMstrEntity userMstrEntity = UserMstrEntity.builder()
          .userNo(groupMemberUser.getUserNo())
          .grpId(grpId)
          .build();
        userMstr.add(userMstrEntity);
      }

      
      result = accountDAO.updateUsers(userMstr);

      return result;
  };

  @Transactional
    public boolean updateGroup(GroupDTO groupDTO) throws SQLException{
      
      boolean result = false;
      List<UserMstrEntity> userMstr = new ArrayList<>();
      int grpId = groupDTO.getGrpId();

      GroupMstrEntity groupMstrEntity = GroupMstrEntity.builder()
        .grpId(groupDTO.getGrpId())
        .grpNm(groupDTO.getGrpNm())
        .grpRunMode(groupDTO.getGrpRunMode())
        .grpDesc(groupDTO.getGrpDesc())
        .build();

      result = accountDAO.updateGroup(groupMstrEntity);

      if (!result) throw new SQLException("그룹이 업데이트 되지 않았습니다.");

      result = accountDAO.updateUserDefaultGroup(groupMstrEntity);

      for (GroupMemberUserModel groupMemberUser : groupDTO.getGrpMemberUser())
      {
        UserMstrEntity userMstrEntity = UserMstrEntity.builder()
          .userNo(groupMemberUser.getUserNo())
          .grpId(grpId)
          .build();
        userMstr.add(userMstrEntity);
      }

      
      result = accountDAO.updateUsers(userMstr);

      return result;
  };


  @Transactional
    public boolean deleteGroup(GroupDTO groupDTO) throws SQLException{
      
      boolean result = false;

      GroupMstrEntity groupMstrEntity = GroupMstrEntity.builder()
        .grpId(groupDTO.getGrpId())
        .build();
      
      result = accountDAO.deleteGroup(groupMstrEntity);
      result = accountDAO.updateUserDefaultGroup(groupMstrEntity);

      return result;
  };
}
