package com.wise.MarketingPlatForm.account.controller.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.model.user.data.UserDataModel;
import com.wise.MarketingPlatForm.account.service.user.UserDataService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

@RestController
@RequestMapping("/account/user/data")
public class UserDataController{

  @Autowired
  UserDataService userDataService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getUserData() throws Exception{

    List<UserDataModel> model = userDataService.getUserData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

}
