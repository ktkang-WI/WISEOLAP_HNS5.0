package com.wise.MarketingPlatForm.account.service.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserExcelResourceDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserSelectorDTO;
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
      .compCd(userMstr.getCompCode())
      .grpId(userMstr.getGrpId())
      .runMode(userMstr.getUserRunMode())
      .passwd(userMstr.getPasswd())
      .userDesc(userMstr.getUserDesc())
      .build();

    return accountDAO.createUser(user);
  };

  public boolean updateUser(UserGroupDTO userMstr) {
    UserMstrEntity user = UserMstrEntity.builder()
      .userNo(userMstr.getUserNo())
      .userId(userMstr.getUserId())
      .userNm(userMstr.getUserNm())
      .eMail1(userMstr.getEMail1())
      .compCd(userMstr.getCompCode())
      .hpNo(userMstr.getHpNo())
      .eMail2(userMstr.getEMail2())
      .telNo(userMstr.getTelNo())
      .grpId(userMstr.getGrpId())
      .runMode(userMstr.getUserRunMode())
      .userDesc(userMstr.getUserDesc())
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
      .pwChangeDt("11111111")
      .build();
    return accountDAO.updateUserPasswd(user);
  };

  public boolean deleteUser(UserMstrEntity userMstr){
    return accountDAO.deleteUser(userMstr);
  }

  public List<UserMstrEntity> selectUserMstr(UserSelectorDTO userSelector) {
    return accountDAO.selectUserMstr(userSelector);
  }

  public boolean updateExcelResourceUser(UserGroupDTO userMstr, String excelResourceGrp) {

    UserExcelResourceDTO result = accountDAO.selectExcelResourceUser(userMstr.getUserId());

    if (result == null) {
      return false;
    }

    UserExcelResourceDTO user = UserExcelResourceDTO.builder()
      .loginAcId(userMstr.getUserId())
      .userGid(excelResourceGrp)
      .userNm(userMstr.getUserNm())
      .build();
    return accountDAO.updateExcelResourceUser(user);
  };

}
