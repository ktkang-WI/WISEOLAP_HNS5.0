package com.wise.MarketingPlatForm.account.service.group;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.group.GroupAppDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupAppPutDTO;
import com.wise.MarketingPlatForm.account.entity.GroupAuthProgMstrEntity;
import com.wise.MarketingPlatForm.account.model.common.ProgModel;
import com.wise.MarketingPlatForm.account.model.groups.app.GroupAppModel;

@Service
public class GroupAppService {
  @Autowired
  private AccountDAO accountDAO;

  public List<GroupAppModel> getGroupApp() throws Exception {

    List<GroupAppDTO> groupAppDTO = accountDAO.selectGroupApp();

    if (groupAppDTO == null) return null;

    List<GroupAppModel> groupAppModel = generateGroupAppObject(groupAppDTO);

    return groupAppModel;
  };

  public GroupAppModel getGroupAppByGrpId(int grpId) throws Exception {

    GroupAppDTO groupAppDTO = accountDAO.selectGroupAppByGrpId(grpId);

    if (groupAppDTO == null) return null;

    ObjectMapper objectMapper = new ObjectMapper();
    String authData = groupAppDTO.getAuthData();

    GroupAppModel groupAppModel = GroupAppModel.builder()
    .grpId(groupAppDTO.getGrpId())
    .prog(objectMapper.readValue(authData, ProgModel.class))
    .build();

    return groupAppModel;
  };
  
  @Transactional
  public boolean putGroupApp(List<GroupAppPutDTO> groupAppPutDTO) {

    List<GroupAuthProgMstrEntity> groupAuthProgMstr = generateGroupAuthAppObject(groupAppPutDTO);

    if (groupAuthProgMstr == null) return false;

    boolean result = false;
    if (groupAuthProgMstr.size() == 0) {
      result = accountDAO.deleteGroupAppAll();
    } else {
      result = accountDAO.deleteGroupApp(groupAuthProgMstr);
      result = accountDAO.putGroupApp(groupAuthProgMstr);
    }

    return result;
  };

  private List<GroupAppModel> generateGroupAppObject(List<GroupAppDTO> groupAppDTO) throws Exception{

    List<GroupAppModel> result = new ArrayList<>();
    
    for (GroupAppDTO groupApp : groupAppDTO) {

      ObjectMapper objectMapper = new ObjectMapper();
      String authData = groupApp.getAuthData();
    
      GroupAppModel groupAppModel = GroupAppModel.builder()
        .grpId(groupApp.getGrpId())
        .prog(objectMapper.readValue(authData, ProgModel.class))
        .build();

      result.add(groupAppModel);
    }

    return result;
  }
  
  public List<GroupAuthProgMstrEntity> generateGroupAuthAppObject(List<GroupAppPutDTO> groupAppPutDTO) {
    List<GroupAuthProgMstrEntity> result = new ArrayList<>();

    for (GroupAppPutDTO groupAppPut : groupAppPutDTO) {
      int grpId = groupAppPut.getGrpId();
      ProgModel progModel = groupAppPut.getProg();

      ObjectMapper objectMapper = new ObjectMapper();
        try {
            String jsonAuthData = objectMapper.writeValueAsString(progModel);
            // 변환된 JSON을 authData에 저장
            GroupAuthProgMstrEntity groupAuthProgMstrEntity = GroupAuthProgMstrEntity.builder()
            .grpId(grpId)
            .authData(jsonAuthData)
            .build();

            result.add(groupAuthProgMstrEntity);
            
        } catch (JsonProcessingException e) {
            e.printStackTrace(); // JSON 변환 실패 시 예외 처리
        }
    }

    return result;
  }
}
