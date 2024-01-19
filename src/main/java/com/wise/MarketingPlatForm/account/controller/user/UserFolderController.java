package com.wise.MarketingPlatForm.account.controller.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.model.user.folder.UserFolderModel;
import com.wise.MarketingPlatForm.account.service.user.UserFolderService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

@RestController
@RequestMapping("/account/user/folder")
public class UserFolderController {
  
  @Autowired
  private UserFolderService userFolderService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getUserFolderData() throws Exception{

    List<UserFolderModel> model = userFolderService.getUserFolderData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

}
