package com.wise.MarketingPlatForm.account.controller.group;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.lang.reflect.Type;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.wise.MarketingPlatForm.account.dto.group.GroupDTO;
import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.account.model.groups.GroupMemberUserModel;
import com.wise.MarketingPlatForm.account.service.group.GroupService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "group", description = "그룹정보 데이터를 관리합니다.")
@RestController
@RequestMapping("/account/group")
public class GroupController{
  // private static final Logger logger = LoggerFactory.getLogger(GroupController.class);

  @Autowired
  private GroupService groupService;

  private Type grpMemberUserType = new TypeToken<ArrayList<GroupMemberUserModel>>() {}.getType();
  private Gson gson = new Gson();

  @GetMapping
  public ResponseEntity<RestAPIVO> getGroup() throws Exception{

    List<GroupMstrEntity> model = groupService.getGroup();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

  @PostMapping
  public ResponseEntity<RestAPIVO> createData(
      @RequestParam(required = true) String grpNm,
      @RequestParam(required = false, defaultValue = "") String grpDesc,
      @RequestParam(required = true, defaultValue = "") String grpRunMode,
      @RequestParam(required = false, defaultValue = "data") String key,
      @RequestBody Map<String, Object> body
  ) throws SQLException{

    String grpMemberUserData = body.get(key).toString();

    if (!body.containsKey(key)) {
        return RestAPIVO.badRequest(false);
    }

    List<GroupMemberUserModel> groupmemberUser = gson.fromJson(grpMemberUserData, grpMemberUserType);
    
    GroupDTO groupDTO = GroupDTO.builder()
      .grpNm(grpNm)
      .grpDesc(grpDesc)
      .grpRunMode(grpRunMode)
      .grpMemberUser(groupmemberUser)
      .build();

    boolean result = groupService.createGroup(groupDTO);

    if (!result) return RestAPIVO.conflictResponse(false);

    return RestAPIVO.okResponse(true);
  }

  @PatchMapping
  public ResponseEntity<RestAPIVO> updateData(
      @RequestParam(required = true) int grpId,
      @RequestParam(required = false, defaultValue = "") String grpNm,
      @RequestParam(required = false, defaultValue = "") String grpDesc,
      @RequestParam(required = false, defaultValue = "") String grpRunMode,
      @RequestParam(required = false, defaultValue = "data") String key,
      @RequestBody Map<String, Object> body
  ) throws SQLException{
    String grpMemberUserData = body.get(key).toString();

    if (!body.containsKey(key)) {
      return RestAPIVO.badRequest(false);
    }

    List<GroupMemberUserModel> groupmemberUser = gson.fromJson(grpMemberUserData,grpMemberUserType);
    
    GroupDTO groupDTO = GroupDTO.builder()
      .grpId(grpId)
      .grpNm(grpNm)
      .grpDesc(grpDesc)
      .grpRunMode(grpRunMode)
      .grpMemberUser(groupmemberUser)
      .build();
  
    boolean result = groupService.updateGroup(groupDTO);

    if (!result) return RestAPIVO.conflictResponse(false);

    return RestAPIVO.okResponse(true);
  }

  
  @DeleteMapping
  public ResponseEntity<RestAPIVO> deleteData(
    @RequestParam(required = true) int grpId
  ) throws SQLException{

    GroupDTO groupDTO = GroupDTO.builder()
      .grpId(grpId)
      .build();

    boolean result = groupService.deleteGroup(groupDTO);

    if (!result) return RestAPIVO.conflictResponse(false, "The data doesn't update");
  
    return RestAPIVO.okResponse(true);

  }

}
