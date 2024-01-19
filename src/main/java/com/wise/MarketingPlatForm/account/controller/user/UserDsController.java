package com.wise.MarketingPlatForm.account.controller.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.model.user.ds.UserDsModel;
import com.wise.MarketingPlatForm.account.service.user.UserDsService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

@RestController
@RequestMapping("/account/user/ds")
public class UserDsController {
  
@Autowired
  UserDsService userDsService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getUserDs() throws Exception{

    List<UserDsModel> model = userDsService.getUserDs();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }
}
