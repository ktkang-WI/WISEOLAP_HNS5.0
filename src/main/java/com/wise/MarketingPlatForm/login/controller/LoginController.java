package com.wise.MarketingPlatForm.login.controller;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.dto.myPage.MyDesignerDTO;
import com.wise.MarketingPlatForm.config.service.myPage.MyPageDesignerConfigService;
import com.wise.MarketingPlatForm.global.util.SessionUtility;
import com.wise.MarketingPlatForm.log.service.LogService;
import com.wise.MarketingPlatForm.log.vo.LoginLogDTO;
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
    private final LogService logService;

    LoginController(LoginService loginService, LogService logService) {
        this.loginService = loginService;
        this.logService = logService;
    }

    @Operation(summary = "login", description = "user 정보를 확인하여 로그인 세션을 만듭니다.")
    @Parameters({
            @Parameter(name = "id", description = "아이디"),
            @Parameter(name = "password", description = "패스워드"),
    })
    @PostMapping("/login")
    public ResponseEntity<Object> login(HttpServletRequest request, @RequestBody Map<String, String> param) {
        String id = param.getOrDefault("id", "");
        // front에서 입력한 pw 암호화? axios 통신 전 암호화?
        String password = param.getOrDefault("password", "");

        UserDTO userDTO = loginService.getLoginUser(id, password);

        if (userDTO != null) {
            
            if (userDTO.getIsChangePw() > 0) {
                Map<String, Integer> chagePw = new HashMap<>();
                chagePw.put("change", userDTO.getIsChangePw());
                return ResponseEntity.ok().body(chagePw);
            }
            SessionUtility.setSessionUser(request, userDTO);
            
            Timestamp currentTime = new Timestamp(System.currentTimeMillis());

            LoginLogDTO logDTO = LoginLogDTO.builder()
                .logType("LOGIN")
                .eventStamp(currentTime)
                .modStamp(currentTime)
                .modUserNo(userDTO.getUserNo())
                .userNo(userDTO.getUserNo())
                .userId(userDTO.getUserId())
                .userNm(userDTO.getUserNm())
                .groupId(userDTO.getGrpId())
                .accessIp(request.getRemoteAddr())
                .build();

            logService.insertLoginLog(logDTO);
            // 로그인 성공 직후 개인설정 가져오기.
            int userNo = userDTO.getUserNo();
            MyDesignerDTO model = myPageDesignerConfig.getDesignerConfigData(userNo);

            if (model == null) {
                return ResponseEntity.ok().build();
            }

            model.setRunMode(userDTO.getRunMode());
            model.setGrpRunMode(userDTO.getGrpRunMode());
            
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
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        UserDTO userDTO = SessionUtility.getSessionUser(request);

        if (userDTO == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        LoginLogDTO logDTO = LoginLogDTO.builder()
        .logType("LOGOUT")
        .eventStamp(currentTime)
        .modStamp(currentTime)
        .modUserNo(userDTO.getUserNo())
        .userNo(userDTO.getUserNo())
        .userId(userDTO.getUserId())
        .userNm(userDTO.getUserNm())
        .groupId(userDTO.getGrpId())
        .accessIp(request.getRemoteAddr())
        .build();

        logService.insertLoginLog(logDTO);

        SessionUtility.clearSessionUser(request);

        return ResponseEntity.ok().build();
    }
    @Operation(summary = "logout", description = "사용자의 모든 세션을 삭제합니다.")
    @GetMapping("/logoutsso")
    @ResponseBody
    public void logoutsso(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        UserDTO userDTO = SessionUtility.getSessionUser(request);
        LoginLogDTO logDTO = LoginLogDTO.builder()
        .logType("LOGOUT")
        .eventStamp(currentTime)
        .modStamp(currentTime)
        .modUserNo(userDTO.getUserNo())
        .userNo(userDTO.getUserNo())
        .userId(userDTO.getUserId())
        .userNm(userDTO.getUserNm())
        .groupId(userDTO.getGrpId())
        .accessIp(request.getRemoteAddr())
        .build();

        logService.insertLoginLog(logDTO);

        SessionUtility.clearSessionUser(request);
        response.sendRedirect("/editds");
    }

    @GetMapping("/session-check")
    public ResponseEntity<Object> sessionCheck(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        UserDTO userDTO = SessionUtility.getSessionUser(request);

        if (userDTO == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok().build();
    }

    @Scheduled(cron = "0 0 */8 * * ?")
    public void clearSessionUserSchedule() {
        SessionUtility.clearSessionUserSchedule();
    }
}
