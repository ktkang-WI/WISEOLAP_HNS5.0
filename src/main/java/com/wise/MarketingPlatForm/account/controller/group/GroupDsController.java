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
import com.wise.MarketingPlatForm.account.dto.group.GroupDsPutDTO;
import com.wise.MarketingPlatForm.account.model.groups.ds.GroupDsModel;
import com.wise.MarketingPlatForm.account.service.group.GroupDsService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "group-ds", description = "그룹정보 데이터원본을 관리합니다.")
@RestController
@RequestMapping("/account/group/ds")
public class GroupDsController {
  
  @Autowired
  GroupDsService groupDsService;

  private Type grpDsPutType = new TypeToken<ArrayList<GroupDsPutDTO>>() {}.getType();
  private Gson gson = new Gson();

  @GetMapping
  public ResponseEntity<RestAPIVO> getGroupDs() throws Exception{

    List<GroupDsModel> model = groupDsService.getGroupDs();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

  @PutMapping
  public ResponseEntity<RestAPIVO> putGroupDs(
    @RequestParam(required = false, defaultValue = "data") String key,
    @RequestBody Map<String, Object> body
  ) throws Exception{

    String grpDsPutData = body.get(key).toString();

    if (!body.containsKey(key)) {
      return RestAPIVO.badRequest(false);
    }

    List<GroupDsPutDTO> groupDsPutDTO = gson.fromJson(grpDsPutData, grpDsPutType);

    boolean result = groupDsService.putGroupDs(groupDsPutDTO);

    if (!result) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(result);
  }

}
