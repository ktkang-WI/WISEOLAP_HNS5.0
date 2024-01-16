package com.wise.MarketingPlatForm.account.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.lang.reflect.Type;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.wise.MarketingPlatForm.account.dto.GroupDTO;
import com.wise.MarketingPlatForm.account.model.GroupsModel.GroupMemberUserModel;
import com.wise.MarketingPlatForm.account.service.GroupService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "user-group", description = "환경설정 관련 유저 정보를 관리합니다.")
@RestController
@RequestMapping("/config/group")
public class GroupController {
  // private static final Logger logger = LoggerFactory.getLogger(GroupController.class);

  @Autowired
  private GroupService groupService;

  private Type grpMemberUserType = new TypeToken<ArrayList<GroupMemberUserModel>>() {}.getType();
  private Gson gson = new Gson();

  @PostMapping
  public boolean createGroup(
      @RequestParam(required = true) String grpNm,
      @RequestParam(required = false, defaultValue = "") String grpDesc,
      @RequestParam(required = true, defaultValue = "") String grpRunMode,
      @RequestParam(required = false, defaultValue = "") String grpMemberUser,
      @RequestBody Map<String, Object> body
  ) throws SQLException{
    String grpMemberUserData = body.get(grpMemberUser).toString();
    List<GroupMemberUserModel> groupmemberUser = gson.fromJson(grpMemberUserData,grpMemberUserType);
    
    GroupDTO groupDTO = GroupDTO.builder()
      .grpNm(grpNm)
      .grpDesc(grpDesc)
      .grpRunMode(grpRunMode)
      .grpMemberUser(groupmemberUser)
      .build();

    return groupService.createGroup(groupDTO);
  }

  @PatchMapping
  public boolean updateGroup(
      @RequestParam(required = true) int grpId,
      @RequestParam(required = false, defaultValue = "") String grpNm,
      @RequestParam(required = false, defaultValue = "") String grpDesc,
      @RequestParam(required = false, defaultValue = "") String grpRunMode,
      @RequestParam(required = false, defaultValue = "") String grpMemberUser,
      @RequestBody Map<String, Object> body
  ) throws SQLException{
    String grpMemberUserData = body.get(grpMemberUser).toString();
    List<GroupMemberUserModel> groupmemberUser = gson.fromJson(grpMemberUserData,grpMemberUserType);
    
    GroupDTO groupDTO = GroupDTO.builder()
      .grpId(grpId)
      .grpNm(grpNm)
      .grpDesc(grpDesc)
      .grpRunMode(grpRunMode)
      .grpMemberUser(groupmemberUser)
      .build();
    
    return groupService.updateGroup(groupDTO);
  }

  @DeleteMapping
  public boolean deleteGroup(
    @RequestParam(required = true) int grpId
  ) throws SQLException{

    GroupDTO groupDTO = GroupDTO.builder()
      .grpId(grpId)
      .build();

    return groupService.deleteGroup(groupDTO);
  }

}
