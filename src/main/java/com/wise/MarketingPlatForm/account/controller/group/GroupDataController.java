package com.wise.MarketingPlatForm.account.controller.group;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.model.groups.data.GroupDataModel;
import com.wise.MarketingPlatForm.account.service.group.GroupDataService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "group-data", description = "그룹이 가지고 있는 데이터 를 관리합니다.")
@RestController
@RequestMapping("/account/group/data")
public class GroupDataController {
  
  @Autowired
  GroupDataService groupDataService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getGroupData() throws Exception{

    List<GroupDataModel> model = groupDataService.getGroupData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

}
