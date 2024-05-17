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
import com.wise.MarketingPlatForm.account.dto.user.UserDatasetPutDTO;
import com.wise.MarketingPlatForm.account.model.user.dataset.UserDatasetModel;
import com.wise.MarketingPlatForm.account.service.user.UserDatasetService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "user-dataset", description = "유저 정보 데이터셋을 관리합니다.")
@RestController
@RequestMapping("/account/user/dataset")
public class UserDatasetController {

  @Autowired
  UserDatasetService userDatasetService;

  private Type userDatasetPutType = new TypeToken<ArrayList<UserDatasetPutDTO>>() {}.getType();
  private Gson gson = new Gson();

  @GetMapping
  public ResponseEntity<RestAPIVO> getUserDataset() throws Exception{

    List<UserDatasetModel> model = userDatasetService.getUserDataset();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

  @PutMapping
  public ResponseEntity<RestAPIVO> putUserDataset(
    @RequestParam(required = false, defaultValue = "data") String key,
    @RequestBody Map<String, Object> body
  ) throws Exception{

    String userDatasetPutData = body.get(key).toString();

    if (!body.containsKey(key)) {
      return RestAPIVO.badRequest(false);
    }
    List<UserDatasetPutDTO> userDatasetPutDTO = gson.fromJson(userDatasetPutData, userDatasetPutType);

    boolean result = userDatasetService.putUserDataset(userDatasetPutDTO);

    return RestAPIVO.okResponse(result);
  }
}
