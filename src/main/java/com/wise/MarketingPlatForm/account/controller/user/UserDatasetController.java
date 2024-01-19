package com.wise.MarketingPlatForm.account.controller.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.model.user.dataset.UserDatasetModel;
import com.wise.MarketingPlatForm.account.service.user.UserDatasetService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

@RestController
@RequestMapping("/account/user/dataset")
public class UserDatasetController {

  @Autowired
  UserDatasetService userDatasetService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getUserDataset() throws Exception{

    List<UserDatasetModel> model = userDatasetService.getUserDataset();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }
}
