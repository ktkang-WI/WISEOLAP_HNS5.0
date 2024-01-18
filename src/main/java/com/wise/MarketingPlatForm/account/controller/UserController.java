package com.wise.MarketingPlatForm.account.controller;

import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.entity.UserMstrEntity;
import com.wise.MarketingPlatForm.account.service.UserService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

import io.swagger.v3.oas.annotations.tags.Tag;


@Tag(name = "user", description = "환경설정 관련 유저 정보를 관리합니다.")
@RestController
@RequestMapping("/account/user")
public class UserController {
  
  @Autowired
  private UserService userService;

  @PostMapping
  public ResponseEntity<RestAPIVO> createUser(
      @RequestParam(required = true) String userId,
      @RequestParam(required = true) String userNm,
      @RequestParam(required = false, defaultValue = "") String email_1,
      @RequestParam(required = false, defaultValue = "") String email_2,
      @RequestParam(required = false, defaultValue = "") String telNo,
      @RequestParam(required = false, defaultValue = "0") int grpId,
      @RequestParam(required = false, defaultValue = "") String grpNm,
      @RequestParam(required = true) String userRunMode,
      @RequestParam(required = false, defaultValue = "") String grpRunMode,
      @RequestParam(required = false, defaultValue = "") String userDesc,
      @RequestParam(required = false, defaultValue = "") String passwd
  ) throws SQLException{

    UserMstrEntity userMstr = UserMstrEntity.builder()
      .userId(userId)
      .userNm(userNm)
      .eMail1(email_1)
      .eMail2(email_2)
      .telNo(telNo)
      .grpId(grpId)
      .grpNm(grpNm)
      .userRunMode(userRunMode)
      .grpRunMode(grpRunMode)
      .userDesc(userDesc)
      .passwd(passwd)
      .build();
    
    boolean result = userService.createUser(userMstr);

    if (!result) return RestAPIVO.conflictResponse(false);

    return RestAPIVO.okResponse(true);
  }

  @PatchMapping
  public ResponseEntity<RestAPIVO> updateUser(
    @RequestParam(required = true) int userNo,
    @RequestParam(required = false, defaultValue = "") String userId,
    @RequestParam(required = false, defaultValue = "") String userNm,
    @RequestParam(required = false, defaultValue = "") String email_1,
    @RequestParam(required = false, defaultValue = "") String email_2,
    @RequestParam(required = false, defaultValue = "") String telNo,
    @RequestParam(required = false, defaultValue = "0") int grpId,
    @RequestParam(required = false, defaultValue = "") String grpNm,
    @RequestParam(required = false, defaultValue = "") String userRunMode,
    @RequestParam(required = false, defaultValue = "") String grpRunMode,
    @RequestParam(required = false, defaultValue = "") String userDesc
  ) throws SQLException{

    UserMstrEntity userMstr = UserMstrEntity.builder()
      .userNo(userNo)
      .userId(userId)
      .userNm(userNm)
      .eMail1(email_1)
      .eMail2(email_2)
      .telNo(telNo)
      .grpId(grpId)
      .grpNm(grpNm)
      .userRunMode(userRunMode)
      .grpRunMode(grpRunMode)
      .userDesc(userDesc)
      .build();
    
    boolean result = userService.updateUser(userMstr);

    if (!result) return RestAPIVO.conflictResponse(false);
  
    return RestAPIVO.okResponse(true);

  }

  @PatchMapping(value="/password")
  public ResponseEntity<RestAPIVO> updateGroup(
      @RequestParam(required = true) int userNo,
      @RequestParam(required = false, defaultValue = "") String passwd
  ) throws SQLException{

    UserMstrEntity userMstr = UserMstrEntity.builder()
      .userNo(userNo)
      .passwd(passwd)
      .build();
    
    boolean result = userService.updateUserPasswd(userMstr);

    if (!result) return RestAPIVO.conflictResponse(false);
  
    return RestAPIVO.okResponse(true);
  }

  @DeleteMapping
  public ResponseEntity<RestAPIVO> deleteGroup(
    @RequestParam(required = true) int userNo
  ) throws SQLException{

    UserMstrEntity userMstr = UserMstrEntity.builder()
      .userNo(userNo)
      .build();

    boolean result = userService.deleteUser(userMstr);

    if (!result) return RestAPIVO.conflictResponse(false);
  
    return RestAPIVO.okResponse(true);
  }


}
