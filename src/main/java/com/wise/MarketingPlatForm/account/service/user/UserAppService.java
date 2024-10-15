package com.wise.MarketingPlatForm.account.service.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.user.UserAppDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserAppPutDTO;
import com.wise.MarketingPlatForm.account.entity.UserAuthProgMstrEntity;
import com.wise.MarketingPlatForm.account.model.common.ProgModel;
import com.wise.MarketingPlatForm.account.model.user.app.UserAppModel;

@Service
public class UserAppService {
  @Autowired
  private AccountDAO accountDAO;
 
  public List<UserAppModel> getUserApp() throws Exception {

    List<UserAppDTO> UserAppDTO = accountDAO.selectUserApp();

    if (UserAppDTO == null) return null;

    List<UserAppModel> UserAppModel = generateUserAppObject(UserAppDTO);

    return UserAppModel;
  };

  public UserAppModel getUserAppByUserNo(int userNo) throws Exception {

    UserAppDTO userAppDTO = accountDAO.selectUserAppByUserNo(userNo);

    if (userAppDTO == null) return null;

    ObjectMapper objectMapper = new ObjectMapper();
    String authData = userAppDTO.getAuthData();

    UserAppModel userAppModel = UserAppModel.builder()
    .userNo(userAppDTO.getUserNo())
    .prog(objectMapper.readValue(authData, ProgModel.class))
    .build();

    return userAppModel;
  };

  @Transactional
  public boolean putUserApp(List<UserAppPutDTO> userAppPutDTO) {

    List<UserAuthProgMstrEntity> userAuthProgMstr = generateUserAuthAppObject(userAppPutDTO);

    if (userAuthProgMstr == null) return false;

    boolean result = false;
    // if (userAuthProgMstr.size() == 0) {
    //   result = accountDAO.deleteUserAppAll();
    // } else {
      result = accountDAO.deleteUserApp(userAppPutDTO);
      result = accountDAO.putUserApp(userAuthProgMstr);
    // }

    return result;
  };

  private List<UserAppModel> generateUserAppObject(List<UserAppDTO> userAppDTO) throws Exception{

    List<UserAppModel> result = new ArrayList<>();
    
    for (UserAppDTO userApp : userAppDTO) {

      ObjectMapper objectMapper = new ObjectMapper();
      String authData = userApp.getAuthData();
    
      UserAppModel userAppModel = UserAppModel.builder()
        .userNo(userApp.getUserNo())
        .prog(objectMapper.readValue(authData, ProgModel.class))
        .build();

      result.add(userAppModel);
    }

    return result;
  }

  public List<UserAuthProgMstrEntity> generateUserAuthAppObject(List<UserAppPutDTO> userAppPutDTO) {
    List<UserAuthProgMstrEntity> result = new ArrayList<>();

    for (UserAppPutDTO userAppPut : userAppPutDTO) {
      int userNo = userAppPut.getUserNo();
      ProgModel progModel = userAppPut.getProg();

      ObjectMapper objectMapper = new ObjectMapper();
        try {
            String jsonAuthData = objectMapper.writeValueAsString(progModel);
            // 변환된 JSON을 authData에 저장
            UserAuthProgMstrEntity userAuthProgMstrEntity = UserAuthProgMstrEntity.builder()
            .userNo(userNo)
            .authData(jsonAuthData)
            .build();

            result.add(userAuthProgMstrEntity);
            
        } catch (JsonProcessingException e) {
            e.printStackTrace(); // JSON 변환 실패 시 예외 처리
        }
    }

    return result;
  }
}
