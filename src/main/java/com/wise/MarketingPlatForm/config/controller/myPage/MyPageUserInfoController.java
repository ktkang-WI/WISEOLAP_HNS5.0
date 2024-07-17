package com.wise.MarketingPlatForm.config.controller.myPage;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.service.myPage.MyPageUserInfoService;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;

@Tag(name = "my-page-user-info", description = "마이페이지에 사용자 정보를 가져옵니다.")
@RestController
@RequestMapping("/mypage")
public class MyPageUserInfoController {
  @Autowired
  MyPageUserInfoService myPageUserInfoService;

  @GetMapping("/get-name")
  public String getUserNm(HttpServletRequest request) {
    HttpSession session = request.getSession();
    UserDTO userDTO = (UserDTO)session.getAttribute("WI_SESSION_USER");
    String userNm = userDTO.getUserNm();

    return userNm;
  }

  @GetMapping("/user-info")
  public UserDTO userInfomation(HttpServletRequest request) {
    HttpSession session = request.getSession();
    UserDTO userDTO = (UserDTO)session.getAttribute("WI_SESSION_USER");
    int userNo = userDTO.getUserNo();
  
    UserDTO userInfo = myPageUserInfoService.getUserInfo(userNo);
    return userInfo;
  }

  @PatchMapping(value = "/user-info/update-password")
  public Object updatePassword(
    @RequestParam(required = true) String currPassword,
    @RequestParam(required = true) String newPassword,
    @RequestParam(required = true) String checkPassword,
    HttpServletRequest request
  ) {
    // session
    HttpSession session = request.getSession();
    UserDTO userDTO = (UserDTO)session.getAttribute("WI_SESSION_USER");
    int userNo = userDTO.getUserNo();
    // 로그인 비밀번호 맞는지 여부
    Map<String, String> result = myPageUserInfoService.checkCurrentPassword(userNo, currPassword);
    
    // 로그인 비밀번호 맞으면 비밀번호 업데이트 진행.
    if ("Success".equals(result.get("invalidStatus"))) {
      UserDTO userInfo = UserDTO.builder()
        .password(newPassword)
        .userNo(userNo)
        .build();
      Map<String, String> updateResult = myPageUserInfoService.modifyPassword(userInfo);
      result = updateResult;
    }
    return result;
  }
  
  @PatchMapping(value = "/user-info/update-info")
  public boolean updateUserInfo(
    @RequestParam(required = true) int userNo,
    @RequestParam(required = false, defaultValue = "") String userId,
    @RequestParam(required = false, defaultValue = "") String userNm,
    @RequestParam(required = false, defaultValue = "") String email,
    @RequestParam(required = false, defaultValue = "") String email2,
    @RequestParam(required = false, defaultValue = "") String hpNo,
    @RequestParam(required = false, defaultValue = "") String telNo
  ) {
    UserDTO user = UserDTO.builder()
      .userNo(userNo)
      .userId(userId)
      .userNm(userNm)
      .email(email)
      .email2(email2)
      .telNo(telNo)
      .hpNo(hpNo)
      .build();
    boolean res = myPageUserInfoService.modifyUserInfo(user);
    return res;
  }
}
