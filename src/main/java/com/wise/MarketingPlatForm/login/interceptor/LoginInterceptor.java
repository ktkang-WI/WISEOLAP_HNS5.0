package com.wise.MarketingPlatForm.login.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.wise.MarketingPlatForm.auth.type.RunMode;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;

@Component
public class LoginInterceptor implements HandlerInterceptor {
    Logger log = LoggerFactory.getLogger(this.getClass());

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        HttpSession session = request.getSession();
        UserDTO userDTO = (UserDTO)session.getAttribute("user");
        log.info("Request URI == > " + request.getRequestURI());
        log.info("Session User Name == > " + (userDTO == null ? "null" : userDTO.getUserNm()));

        // 로그인(contetxtRoot) 진입 시 동작
        if (request.getRequestURI().equals(request.getContextPath() + "/")) {
            if (userDTO != null) {
                // 세션 존재시 runMode 적용
                RunMode runMode = userDTO.getRunMode();

                if (runMode.equals(RunMode.ADMIN)) {
                    response.sendRedirect(request.getContextPath() + "/dashany");
                } else {
                    response.sendRedirect(request.getContextPath() + "/viewer");
                }
                return false;
            }
        } else if (userDTO == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.sendRedirect(request.getContextPath());
            return false;
        }

        return HandlerInterceptor.super.preHandle(request, response, handler);
    }
}
