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
import com.wise.MarketingPlatForm.account.dto.group.GroupDataPutDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDatasetPutDTO;
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

  private Type grpDataPutType = new TypeToken<ArrayList<GroupDataPutDTO>>() {}.getType();
  private Gson gson = new Gson();

  @GetMapping
  public ResponseEntity<RestAPIVO> getGroupData() throws Exception{

    List<GroupDataModel> model = groupDataService.getGroupData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

  @PutMapping
  public ResponseEntity<RestAPIVO> putGroupData(
    @RequestParam(required = false, defaultValue = "data") String key,
    @RequestBody Map<String, Object> body
  ) throws Exception{

    String grpDataPutData = body.get(key).toString();

    if (!body.containsKey(key)) {
      return RestAPIVO.badRequest(false);
    }
    List<GroupDataPutDTO> groupDataPutDTO = gson.fromJson(grpDataPutData, grpDataPutType);

    boolean result = groupDataService.putGroupData(groupDataPutDTO);

    return RestAPIVO.okResponse(result);
  }

}
