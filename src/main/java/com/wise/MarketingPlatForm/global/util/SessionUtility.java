package com.wise.MarketingPlatForm.global.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;

import com.wise.MarketingPlatForm.auth.vo.UserDTO;

public class SessionUtility {
    
    private final static String SESSION_KEY = "WI_SESSION_USER";
    private final static int SESSION_TIME = 3600;
    
    public static UserDTO getSessionUser(HttpSessionEvent request) {
        HttpSession session = request.getSession();
        UserDTO userDTO = (UserDTO)session.getAttribute(SESSION_KEY);
        return userDTO;
    }
    public static UserDTO getSessionUser(HttpServletRequest request) {
        HttpSession session = request.getSession();
        UserDTO userDTO = (UserDTO)session.getAttribute(SESSION_KEY);
        return userDTO;
    }

    public static void setSessionUser(HttpServletRequest request, UserDTO userDTO) {
        HttpSession session = request.getSession();
        session.setAttribute(SESSION_KEY, userDTO);
        session.setMaxInactiveInterval(SESSION_TIME);
    }

    public static void clearSessionUser(HttpServletRequest request) {
        HttpSession session = request.getSession();
        session.removeAttribute(SESSION_KEY);
    }
}
