package com.wise.MarketingPlatForm.account.controller.group;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.model.groups.dataset.GroupDatasetModel;
import com.wise.MarketingPlatForm.account.service.group.GroupDatasetService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

@RestController
@RequestMapping("/account/group/dataset")
public class GroupDatasetController {
  
  @Autowired
  GroupDatasetService groupDatasetService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getGroupDataset() throws Exception{

    List<GroupDatasetModel> model = groupDatasetService.getGroupDataset();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }
}
