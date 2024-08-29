package com.wise.MarketingPlatForm.login.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.auth.service.AuthService;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;

@Service
public class LoginService {
    @Autowired
    AuthService authService;

    public UserDTO getLoginUser(String id, String password) {
        UserDTO userDTO = authService.getUserById(id);
        
        if (userDTO != null && password.equals(userDTO.getPassword())) {
            GroupMstrEntity grpEntity = authService.getUserGroupById(userDTO.getGrpId());
            if (grpEntity != null) {
                userDTO.setGrpRunMode(grpEntity.getGrpRunMode());
            }
            return userDTO;
        } else {
            return null;
        }
    }
}
