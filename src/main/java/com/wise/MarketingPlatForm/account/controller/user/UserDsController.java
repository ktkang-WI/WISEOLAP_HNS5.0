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
import com.wise.MarketingPlatForm.account.dto.user.UserDsPutDTO;
import com.wise.MarketingPlatForm.account.model.user.ds.UserDsModel;
import com.wise.MarketingPlatForm.account.service.user.UserDsService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "user-ds", description = "유저 정보 데이터원본을 관리합니다.")
@RestController
@RequestMapping("/account/user/ds")
public class UserDsController {
  
@Autowired
  UserDsService userDsService;

  private Type grpDsPutType = new TypeToken<ArrayList<UserDsPutDTO>>() {}.getType();
  private Gson gson = new Gson();

  @GetMapping
  public ResponseEntity<RestAPIVO> getUserDs() throws Exception{

    List<UserDsModel> model = userDsService.getUserDs();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

  @PutMapping
  public ResponseEntity<RestAPIVO> putUserDs(
    @RequestParam(required = false, defaultValue = "data") String key,
    @RequestBody Map<String, Object> body
  ) throws Exception{

    String grpDsPutData = body.get(key).toString();

    if (!body.containsKey(key)) {
      return RestAPIVO.badRequest(false);
    }

    List<UserDsPutDTO> userDsPutDTO = gson.fromJson(grpDsPutData, grpDsPutType);

    boolean result = userDsService.putUserDs(userDsPutDTO);

    if (!result) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(result);
  }

}
