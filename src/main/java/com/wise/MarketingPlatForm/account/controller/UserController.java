package com.wise.MarketingPlatForm.account.controller;

import java.lang.reflect.Type;
import java.sql.SQLException;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.wise.MarketingPlatForm.account.entity.UserMstrEntity;
import com.wise.MarketingPlatForm.account.model.GroupsModel.GroupMemberUserModel;
import com.wise.MarketingPlatForm.account.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;


@Tag(name = "user", description = "환경설정 관련 유저 정보를 관리합니다.")
@RestController
@RequestMapping("/config/user")
public class UserController {
  
  @Autowired
  private UserService userService;

  private Type grpMemberUserType = new TypeToken<ArrayList<GroupMemberUserModel>>() {}.getType();
  private Gson gson = new Gson();


  @PostMapping
  public boolean createUser(
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
    
    return userService.createUser(userMstr);
  }

  @PatchMapping
  public boolean updateUser(
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
    
    return userService.updateUser(userMstr);
  }

  @PatchMapping(value="/password")
  public boolean updateGroup(
      @RequestParam(required = true) int userNo,
      @RequestParam(required = false, defaultValue = "") String passwd
  ) throws SQLException{

    UserMstrEntity userMstr = UserMstrEntity.builder()
      .userNo(userNo)
      .passwd(passwd)
      .build();
    
    return userService.updateUserPasswd(userMstr);
  }

  @DeleteMapping
  public boolean deleteGroup(
    @RequestParam(required = true) int userNo
  ) throws SQLException{

    UserMstrEntity userMstr = UserMstrEntity.builder()
      .userNo(userNo)
      .build();

    return userService.deleteUser(userMstr);
  }


}
