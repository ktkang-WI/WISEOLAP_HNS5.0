package com.wise.MarketingPlatForm.login.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.wise.MarketingPlatForm.auth.vo.UserDTO;

@Component
public class LoginInterceptor implements HandlerInterceptor {
    Logger log = LoggerFactory.getLogger(this.getClass());

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        HttpSession session = request.getSession();
        UserDTO userDTO = (UserDTO)session.getAttribute("user");
        log.info("Request URI == > " + request.getRequestURI());

        // if (userDTO == null) {
        //     response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        //     response.sendRedirect(request.getContextPath());
        //     return false;
        // }

        return HandlerInterceptor.super.preHandle(request, response, handler);
    }
}
