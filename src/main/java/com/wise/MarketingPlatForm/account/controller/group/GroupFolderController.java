package com.wise.MarketingPlatForm.account.controller.group;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
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

  private Type groupFolderModelType = new TypeToken<ArrayList<GroupFolderModel>>() {}.getType();
  private Gson gson = new Gson();

  @GetMapping
  public ResponseEntity<RestAPIVO> getGroupFolderData() throws Exception{

    List<GroupFolderModel> model = groupFolderService.getGroupFolderData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

  @PutMapping
  public ResponseEntity<RestAPIVO> patchGroupFolderData(
    @RequestParam(required = false, defaultValue = "data") String key,
    @RequestBody Map<String, Object> body
  ) throws Exception{

    String groupFolderPatchData = body.get(key).toString();

    if (!body.containsKey(key)) {
      return RestAPIVO.badRequest(false);
    }

    List<GroupFolderModel> groupFolderModel = gson.fromJson(groupFolderPatchData, groupFolderModelType);

    boolean result = groupFolderService.patchGroupFolder(groupFolderModel);

    return RestAPIVO.okResponse(result);
  }
}
