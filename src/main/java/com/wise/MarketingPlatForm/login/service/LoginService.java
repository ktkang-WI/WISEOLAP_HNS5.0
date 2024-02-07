package com.wise.MarketingPlatForm.login.service;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.auth.service.AuthService;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;

@Service
public class LoginService {
    @Autowired
    AuthService authService;
    // 세션 유지 시간 1800(30분)
    final int SESSION_TIME = 1800;

    public UserDTO getLoginUser(String id, String password) {
        UserDTO userDTO = authService.getUserById(id);

        if (userDTO != null && password.equals(userDTO.getPassword())) {
            return userDTO;
        } else {
            return null;
        }
    }

    public void createLoginSession(HttpSession session, UserDTO userDTO) {
        session.setAttribute("user", userDTO);
        session.setMaxInactiveInterval(SESSION_TIME);
    }

    public void deleteSession(HttpSession session) {
        session.invalidate();
    }
}
