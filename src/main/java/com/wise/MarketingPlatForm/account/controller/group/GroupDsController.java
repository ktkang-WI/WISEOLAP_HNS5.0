package com.wise.MarketingPlatForm.account.controller.group;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.model.groups.ds.GroupDsModel;
import com.wise.MarketingPlatForm.account.service.group.GroupDsService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

@RestController
@RequestMapping("/account/group/ds")
public class GroupDsController {
  
  @Autowired
  GroupDsService groupDsService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getGroupDs() throws Exception{

    List<GroupDsModel> model = groupDsService.getGroupDs();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

}
