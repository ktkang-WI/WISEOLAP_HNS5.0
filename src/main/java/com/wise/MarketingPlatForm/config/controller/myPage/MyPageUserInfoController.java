package com.wise.MarketingPlatForm.config.controller.myPage;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.auth.service.AuthService;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.service.myPage.MyPageUserInfoService;
import com.wise.MarketingPlatForm.global.util.SessionUtility;
import com.wise.MarketingPlatForm.utils.SHA256Util;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;

@Tag(name = "my-page-user-info", description = "마이페이지에 사용자 정보를 가져옵니다.")
@RestController
@RequestMapping("/mypage")
public class MyPageUserInfoController {
  @Autowired
  MyPageUserInfoService myPageUserInfoService;
  
  @Autowired
  AuthService authService;
  
  @Autowired
  SHA256Util sha256Util;

  @GetMapping("/get-name")
  public String getUserNm(HttpServletRequest request) {
    UserDTO userDTO = SessionUtility.getSessionUser(request);
    String userNm = userDTO.getUserNm();

    return userNm;
  }

  @GetMapping("/user-info")
  public UserDTO userInfomation(HttpServletRequest request) {
    UserDTO userDTO = SessionUtility.getSessionUser(request);
    int userNo = userDTO.getUserNo();
  
    UserDTO userInfo = myPageUserInfoService.getUserInfo(userNo);
    return userInfo;
  }

  @PatchMapping(value = "/user-info/update-password")
  public Object updatePassword(
    @RequestParam(required = true) String id,
    @RequestParam(required = true) String currPassword,
    @RequestParam(required = true) String newPassword,
    @RequestParam(required = true) String checkPassword
  ) {
    UserDTO userDTO = authService.getUserById(id);
    int userNo = userDTO.getUserNo();
    // 로그인 비밀번호 맞는지 여부
    Map<String, String> result = myPageUserInfoService.checkCurrentPassword(userNo, currPassword);
    
    // 로그인 비밀번호 맞으면 비밀번호 업데이트 진행.
    if ("Success".equals(result.get("invalidStatus"))) {
      DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      String dateTime = dateFormat.format(new Date());
      UserDTO userInfo = UserDTO.builder()
        .password(newPassword)
        .userNo(userNo)
        .pwChangeDt(dateTime)
        .build();
      Map<String, String> updateResult = myPageUserInfoService.modifyPassword(userDTO, userInfo);
      result = updateResult;
    }

    return result;
  }

  @PatchMapping(value = "/add-change-pw-dt")
  public boolean addChangePwDt(
    @RequestParam(required = true) String pwChangeDt,
    HttpServletRequest request
  ) {
    // session -> 개발 요청 시 getuserByid로 가져오기.
    UserDTO userDTO = SessionUtility.getSessionUser(request);
    userDTO.setPwChangeDt(pwChangeDt);
    
        
    return myPageUserInfoService.patchPwChangeDt(userDTO);
  }
  
  @PatchMapping(value = "/user-info/update-info")
  public boolean updateUserInfo(
    @RequestParam(required = true) int userNo,
    @RequestParam(required = false, defaultValue = "") String userId,
    @RequestParam(required = false, defaultValue = "") String userNm,
    @RequestParam(required = false, defaultValue = "") String email,
    @RequestParam(required = false, defaultValue = "") String email2,
    @RequestParam(required = false, defaultValue = "") String hpNo,
    @RequestParam(required = false, defaultValue = "") String telNo,
    @RequestParam(required = false, defaultValue = "") String compCode
  ) {
    UserDTO user = UserDTO.builder()
      .userNo(userNo)
      .userId(userId)
      .userNm(userNm)
      .compCode(compCode)
      .email(email)
      .email2(email2)
      .telNo(telNo)
      .hpNo(hpNo)
      .build();
    boolean res = myPageUserInfoService.modifyUserInfo(user);
    return res;
  }
}
