package com.wise.MarketingPlatForm.config.service.myPage;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.dao.MyPageConfigDAO;

@Service
public class MyPageUserInfoService {
  @Autowired
  MyPageConfigDAO myPageConfigDAO;

  public UserDTO getUserInfo(int userNo) {
    return myPageConfigDAO.selectUserInfo(userNo);
  }

  public Map<String, String> checkCurrentPassword(int userNo, String currPW) {
    Map<String, String> val = new HashMap<>();
    try {
      String dbPw = myPageConfigDAO.getPassword(userNo);
      if (currPW.equals(dbPw)) {
        val.put("invalidStatus", "Success");
      } else {
        val.put("invalidStatus", "wrongCurrentPw");
        return val;
      }
      
    } catch (Exception e) {
      System.out.println(e);
      val.put("invalidStatus", "ExceptionCheckCurrPw");
      // TODO: handle exception
    }
    return val;
  }

  public Map<String, String> modifyPassword(UserDTO userInfo) {
    Map<String, String> val = new HashMap<>();
    try {
      boolean res = myPageConfigDAO.updatePassword(userInfo);
      if (res) {
        val.put("invalidStatus", "Success");
      } else {
        val.put("invalidStatus", "FailUpdate");
      }
    } catch (Exception e) {
      System.out.println(e);
      val.put("invalidStatus", "ExceptionUpdate");
    }
    return val;
  }

  public boolean modifyUserInfo(UserDTO user) {
    boolean result = false;
    try {
      result = myPageConfigDAO.updateUserInfo(user);
    } catch(Exception e) {
      System.out.println(e);
    }
    return result;
  }
}
