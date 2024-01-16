package com.wise.MarketingPlatForm.account.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.entity.UserMstrEntity;

@Service
public class UserService {
  
  @Autowired
  private AccountDAO accountDAO;

  public boolean createUser(UserMstrEntity userMstr) {
    return accountDAO.createUser(userMstr);
  };

  public boolean updateUser(UserMstrEntity userMstr) {
    return accountDAO.updateUser(userMstr);
  };

  public boolean updateUsers(List<UserMstrEntity> userMstrs) {
    return accountDAO.updateUsers(userMstrs);
  };

  public boolean updateUserPasswd(UserMstrEntity userMstr) {
    return accountDAO.updateUserPasswd(userMstr);
  };

  public boolean deleteUser(UserMstrEntity userMstr){
    return accountDAO.deleteUser(userMstr);
  }

}
