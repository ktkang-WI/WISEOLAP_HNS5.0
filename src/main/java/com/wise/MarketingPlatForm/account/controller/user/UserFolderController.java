package com.wise.MarketingPlatForm.account.controller.user;

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
import com.wise.MarketingPlatForm.account.model.user.folder.UserFolderModel;
import com.wise.MarketingPlatForm.account.service.user.UserFolderService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "user-ds", description = "유저가 가지고 있는 폴더를 관리합니다.")
@RestController
@RequestMapping("/account/user/folder")
public class UserFolderController {

  @Autowired
  private UserFolderService userFolderService;

  private Type userFolderModelType = new TypeToken<ArrayList<UserFolderModel>>() {}.getType();
  private Gson gson = new Gson();

  @GetMapping
  public ResponseEntity<RestAPIVO> getUserFolderData() throws Exception{

    List<UserFolderModel> model = userFolderService.getUserFolderData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

  @PutMapping
  public ResponseEntity<RestAPIVO> patchUserFolderData(
    @RequestParam(required = false, defaultValue = "data") String key,
    @RequestBody Map<String, Object> body
  ) throws Exception{

    String userFolderPatchData = body.get(key).toString();

    if (!body.containsKey(key)) {
      return RestAPIVO.badRequest(false);
    }

    List<UserFolderModel> userFolderModel = gson.fromJson(userFolderPatchData, userFolderModelType);

    boolean result = userFolderService.patchUserFolder(userFolderModel);

    return RestAPIVO.okResponse(result);
  }

}
