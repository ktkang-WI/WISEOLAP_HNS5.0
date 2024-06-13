package com.wise.MarketingPlatForm.login.controller;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.dto.myPage.MyDesignerDTO;
import com.wise.MarketingPlatForm.config.service.myPage.MyPageDesignerConfigService;
import com.wise.MarketingPlatForm.login.service.LoginService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;

@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    MyPageDesignerConfigService myPageDesignerConfig;

    private final LoginService loginService;
    private ObjectMapper mapper = new ObjectMapper();

    LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @Operation(summary = "login", description = "user 정보를 확인하여 로그인 세션을 만듭니다.")
    @Parameters({
            @Parameter(name = "id", description = "아이디"),
            @Parameter(name = "password", description = "패스워드"),
    })
    @PostMapping("/login")
    public ResponseEntity<Object> login(HttpServletRequest request, @RequestBody Map<String, String> param) {
        String id = param.getOrDefault("id", "");
        String password = param.getOrDefault("password", "");

        HttpSession session = request.getSession();

        UserDTO userDTO = loginService.getLoginUser(id, password);

        if (userDTO != null) {
            loginService.createLoginSession(session, userDTO);
            // 로그인 성공 직후 개인설정 가져오기.
            int userNo = userDTO.getUserNo();
            MyDesignerDTO model = myPageDesignerConfig.getDesignerConfigData(userNo);
            
            if (model == null) {
                return ResponseEntity.ok().build();
            }
            
            return ResponseEntity.ok().body(model);
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "check password", description = "id와 비밀번호가 일치하는지 확인합니다.")
    @Parameters({
            @Parameter(name = "id", description = "아이디"),
            @Parameter(name = "password", description = "패스워드"),
    })
    @PostMapping("/check-password")
    public ResponseEntity<Object> checkPassword(HttpServletRequest request, @RequestBody Map<String, String> param) {
        String id = param.getOrDefault("id", "");
        String password = param.getOrDefault("password", "");

        UserDTO userDTO = loginService.getLoginUser(id, password);

        if (userDTO != null) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "logout", description = "사용자의 모든 세션을 삭제합니다.")
    @GetMapping("/logout")
    @ResponseBody
    public ResponseEntity<Object> logout(HttpServletRequest request) {
        HttpSession session = request.getSession();
        loginService.deleteSession(session);

        return ResponseEntity.ok().build();
    }
}
