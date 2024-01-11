package com.wise.MarketingPlatForm.config.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.config.model.UserGroupFormat.UsersGroupsModel;
import com.wise.MarketingPlatForm.config.service.UserGroupService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "user-group", description = "환경설정 관련 유저 정보를 관리합니다.")
@RestController
@RequestMapping("/config")
public class UserGroupController {
  
  private static final Logger logger = LoggerFactory.getLogger(ConfigController.class);

  @Autowired
  private UserGroupService userGroupService;

  @GetMapping(value = "/user-group-data")
  public UsersGroupsModel getGeneralData(){
    logger.info("general-data request is successful");
    return userGroupService.getUserGroupData();
  }
}
