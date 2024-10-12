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
import com.wise.MarketingPlatForm.account.dto.user.UserAppPutDTO;
import com.wise.MarketingPlatForm.account.model.user.app.UserAppModel;
import com.wise.MarketingPlatForm.account.service.user.UserAppService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

@RestController
@RequestMapping("/account/user/app")
public class UserAppController {
  @Autowired UserAppService userAppService;

  private Type userAppPutType = new TypeToken<ArrayList<UserAppPutDTO>>() {}.getType();
  private Gson gson = new Gson();

  @GetMapping
  public ResponseEntity<RestAPIVO> getUserApp() throws Exception{

    List<UserAppModel> model = userAppService.getUserApp();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

  @PutMapping
  public ResponseEntity<RestAPIVO> putUserApp(
    @RequestParam(required = false, defaultValue = "data") String key,
    @RequestBody Map<String, Object> body
  ) throws Exception{

    String userAppPutData = body.get(key).toString();

    if (!body.containsKey(key)) {
      return RestAPIVO.badRequest(false);
    }
    List<UserAppPutDTO> userAppPutDTO = gson.fromJson(userAppPutData, userAppPutType);

    boolean result = userAppService.putUserApp(userAppPutDTO);

    return RestAPIVO.okResponse(result);
  }
}
