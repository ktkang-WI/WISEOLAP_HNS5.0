package com.wise.MarketingPlatForm.account.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.model.common.UsersGroupsModel;
import com.wise.MarketingPlatForm.account.service.UserGroupService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "user-group", description = "유저와 그룹을 조인한 데이터를 관리합니다.")
@RestController
@RequestMapping("/account/user-group")
public class UserGroupController {
  
  // private static final Logger logger = LoggerFactory.getLogger(ConfigController.class);


  @Autowired
  private UserGroupService userGroupService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getGeneralData(){

    UsersGroupsModel model = userGroupService.getUserGroupData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }
}
