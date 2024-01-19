package com.wise.MarketingPlatForm.account.service.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.entity.UserMstrEntity;

@Service
public class UserService {
  
  @Autowired
  private AccountDAO accountDAO;

  public boolean createUser(UserGroupDTO userMstr) {

    UserMstrEntity user = UserMstrEntity.builder()
      .userId(userMstr.getUserId())
      .userNm(userMstr.getUserNm())
      .eMail1(userMstr.getEMail1())
      .eMail2(userMstr.getEMail2())
      .telNo(userMstr.getTelNo())
      .grpId(userMstr.getGrpId())
      .runMode(userMstr.getUserRunMode())
      .passwd(userMstr.getPasswd())
      .build();

    return accountDAO.createUser(user);
  };

  public boolean updateUser(UserGroupDTO userMstr) {
    UserMstrEntity user = UserMstrEntity.builder()
      .userNo(userMstr.getUserNo())
      .userId(userMstr.getUserId())
      .userNm(userMstr.getUserNm())
      .eMail1(userMstr.getEMail1())
      .eMail2(userMstr.getEMail2())
      .telNo(userMstr.getTelNo())
      .grpId(userMstr.getGrpId())
      .runMode(userMstr.getUserRunMode())
      .build();
    return accountDAO.updateUser(user);
  };

  public boolean updateUsers(List<UserGroupDTO> userMstrs) {
    List<UserMstrEntity> result = new ArrayList<>();

    UserMstrEntity userEntity = null;

    for (UserGroupDTO user : userMstrs) {
      userEntity = UserMstrEntity.builder()
        .userNo(user.getUserNo())
        .grpId(user.getGrpId())
        .build();
      result.add(userEntity);
    }

    return accountDAO.updateUsers(result);
  };

  public boolean updateUserPasswd(UserGroupDTO userMstr) {
    UserMstrEntity user = UserMstrEntity.builder()
      .userNo(userMstr.getUserNo())
      .passwd(userMstr.getPasswd())
      .build();
    return accountDAO.updateUserPasswd(user);
  };

  public boolean deleteUser(UserGroupDTO userMstr){
    UserMstrEntity user = UserMstrEntity.builder()
      .userNo(userMstr.getUserNo())
      .build();
    return accountDAO.deleteUser(user);
  }

  public List<UserMstrEntity> selectUserMstr() {
    return accountDAO.selectUserMstr();
  } 

}
