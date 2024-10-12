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
import com.wise.MarketingPlatForm.account.dto.group.GroupAppPutDTO;
import com.wise.MarketingPlatForm.account.model.groups.app.GroupAppModel;
import com.wise.MarketingPlatForm.account.service.group.GroupAppService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

@RestController
@RequestMapping("/account/group/app")
public class GroupAppController {
  @Autowired GroupAppService groupAppService;

  private Type grpAppPutType = new TypeToken<ArrayList<GroupAppPutDTO>>() {}.getType();
  private Gson gson = new Gson();

  @GetMapping
  public ResponseEntity<RestAPIVO> getGroupApp() throws Exception{

    List<GroupAppModel> model = groupAppService.getGroupApp();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

  @PutMapping
  public ResponseEntity<RestAPIVO> putGroupApp(
    @RequestParam(required = false, defaultValue = "data") String key,
    @RequestBody Map<String, Object> body
  ) throws Exception{

    String grpAppPutData = body.get(key).toString();

    if (!body.containsKey(key)) {
      return RestAPIVO.badRequest(false);
    }
    List<GroupAppPutDTO> groupAppPutDTO = gson.fromJson(grpAppPutData, grpAppPutType);

    boolean result = groupAppService.putGroupApp(groupAppPutDTO);

    return RestAPIVO.okResponse(result);
  }
}
