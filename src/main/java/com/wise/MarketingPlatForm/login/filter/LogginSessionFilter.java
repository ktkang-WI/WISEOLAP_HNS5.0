package com.wise.MarketingPlatForm.login.filter;

import java.sql.Timestamp;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.global.util.SessionUtility;
import com.wise.MarketingPlatForm.log.service.LogService;
import com.wise.MarketingPlatForm.log.vo.LoginLogDTO;

@Component
public class LogginSessionFilter implements HttpSessionListener {

    @Autowired
    LogService logService;

    @Override
    public void sessionCreated(HttpSessionEvent httpSessionEvent) {
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent httpSessionEvent) {
        UserDTO userDTO = SessionUtility.getSessionUser(httpSessionEvent);
        if (userDTO == null) return;
        Timestamp currentTime = new Timestamp(System.currentTimeMillis());
        UserDTO dto = (UserDTO) userDTO;
        LoginLogDTO logDTO = LoginLogDTO.builder()
            .logType("LOGOUT")
            .eventStamp(currentTime)
            .modStamp(currentTime)
            .modUserNo(dto.getUserNo())
            .userNo(dto.getUserNo())
            .userId(dto.getUserId())
            .userNm(dto.getUserNm())
            .groupId(dto.getGrpId())
            .accessIp("Logged out due to session expiration")
            .build();
        logService.insertLoginLog(logDTO);
    }
}
