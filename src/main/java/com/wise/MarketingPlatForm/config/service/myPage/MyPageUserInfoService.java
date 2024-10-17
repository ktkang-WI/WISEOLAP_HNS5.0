package com.wise.MarketingPlatForm.config.service.myPage;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.dao.MyPageConfigDAO;
import com.wise.MarketingPlatForm.utils.SHA256Util;

@Service
public class MyPageUserInfoService {
  @Autowired
  MyPageConfigDAO myPageConfigDAO;

  @Autowired
  SHA256Util sha256Util;

  public UserDTO getUserInfo(int userNo) {
    return myPageConfigDAO.selectUserInfo(userNo);
  }

  public Map<String, String> checkCurrentPassword(int userNo, String currPW) {
    Map<String, String> val = new HashMap<>();
    
    try {
      String dbPw = myPageConfigDAO.getPassword(userNo);
      if (currPW.equals(dbPw)) {
        val.put("invalidStatus", "Success");
        return val;
      }
      String encodedPw = sha256Util.encrypt(currPW);
      
      if (encodedPw.equals(dbPw)) {
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

  public Map<String, String> modifyPassword(UserDTO userDTO, UserDTO userInfo) {
    Map<String, String> val = new HashMap<>();
    String dbPw = myPageConfigDAO.getPassword(userInfo.getUserNo());
    try {
      if (dbPw.equals(userInfo.getPassword())) {
        val.put("invalidStatus", "dupleCheckPw");
        return val;
      }
      if (userDTO.getUserId().equals(userInfo.getPassword())) {
        val.put("invalidStatus", "dupleCheckPwId");
        return val;
      }
      if (userDTO.getUserNm().equals(userInfo.getPassword())) {
        val.put("invalidStatus", "dupleCheckPwId");
        return val;
      }
      String encodedPw = sha256Util.encrypt(userInfo.getPassword());
      String encodedId = sha256Util.encrypt(userDTO.getUserId());
      String encodedNm = sha256Util.encrypt(userDTO.getUserNm());
      userInfo.setPassword(encodedPw);
  
      if (dbPw.equals(encodedPw)) {
        val.put("invalidStatus", "dupleCheckPw");
        return val;
      }
      if (encodedPw.equals(encodedId)) {
        val.put("invalidStatus", "dupleCheckPwId");
        return val;
      }
      if (encodedPw.equals(encodedNm)) {
        val.put("invalidStatus", "dupleCheckPwId");
        return val;
      }
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

  public boolean patchPwChangeDt(UserDTO userDTO) {
    boolean res = false;
    try {
      res = myPageConfigDAO.updatePwChangeDt(userDTO);
    } catch (Exception e) {
      System.out.println(e);
    }
    return res;
  }
}
