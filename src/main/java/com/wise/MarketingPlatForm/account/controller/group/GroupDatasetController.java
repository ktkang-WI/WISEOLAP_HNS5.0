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
import com.wise.MarketingPlatForm.account.dto.group.GroupDatasetPutDTO;
import com.wise.MarketingPlatForm.account.model.groups.dataset.GroupDatasetModel;
import com.wise.MarketingPlatForm.account.service.group.GroupDatasetService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

import io.swagger.v3.oas.annotations.tags.Tag;


@Tag(name = "group-dataset", description = "그룹정보 데이터셋를 관리합니다.")
@RestController
@RequestMapping("/account/group/dataset")
public class GroupDatasetController {
  
  @Autowired
  GroupDatasetService groupDatasetService;

  private Type grpDatasetPutType = new TypeToken<ArrayList<GroupDatasetPutDTO>>() {}.getType();
  private Gson gson = new Gson();

  @GetMapping
  public ResponseEntity<RestAPIVO> getGroupDataset() throws Exception{

    List<GroupDatasetModel> model = groupDatasetService.getGroupDataset();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

  @PutMapping
  public ResponseEntity<RestAPIVO> putGroupDataset(
    @RequestParam(required = false, defaultValue = "data") String key,
    @RequestBody Map<String, Object> body
  ) throws Exception{

    String grpDatasetPutData = body.get(key).toString();

    if (!body.containsKey(key)) {
      return RestAPIVO.badRequest(false);
    }
    List<GroupDatasetPutDTO> groupDatasetPutDTO = gson.fromJson(grpDatasetPutData, grpDatasetPutType);

    boolean result = groupDatasetService.putGroupDataset(groupDatasetPutDTO);

    return RestAPIVO.okResponse(result);
  }
}
