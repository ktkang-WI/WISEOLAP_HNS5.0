package com.wise.MarketingPlatForm.account.controller.group;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.model.groups.folder.GroupFolderModel;
import com.wise.MarketingPlatForm.account.service.group.GroupFolderService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "group-folder", description = "그룹정보 폴더정보를 관리합니다.")
@RestController
@RequestMapping("/account/group/folder")
public class GroupFolderController {
  
  @Autowired
  private GroupFolderService groupFolderService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getGroupFolderData() throws Exception{

    List<GroupFolderModel> model = groupFolderService.getGroupFolderData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }
}
