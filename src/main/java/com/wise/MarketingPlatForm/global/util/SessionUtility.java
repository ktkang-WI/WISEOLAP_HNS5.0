package com.wise.MarketingPlatForm.global.util;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.auth.entity.UserEntity;
import com.wise.MarketingPlatForm.auth.type.RunMode;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.global.session.dao.SessionDAO;
import com.wise.MarketingPlatForm.global.session.entity.UserSessionEntity;

import org.apache.commons.codec.digest.DigestUtils;

@Service
public class SessionUtility {

    @Autowired
    private static SessionDAO sessionDAO;

    private static String sessionType;

    @Value("${session.type}")
    private String configSessionType;

    public SessionUtility(SessionDAO sessionDAO) {
        SessionUtility.sessionDAO = sessionDAO;
    }
    @PostConstruct
    private void init() {
        SessionUtility.sessionType = this.configSessionType;
    }
    
    private final static String SESSION_KEY = "WI_SESSION_USER";
    private final static int SESSION_TIME = 60 * 60 * 2;

    private static UserDTO getSessionUser(HttpSession session) {
        return (UserDTO)session.getAttribute(SESSION_KEY);
    }
    

    public static UserDTO getSessionUser(HttpSessionEvent request) {
        return getSessionUser(request.getSession());
    }
    public static UserDTO getSessionUser(HttpServletRequest request) { 
        if ("database".equalsIgnoreCase(sessionType)) {
            return getSessionUserFromDatabase(request);
        } else {
            return getSessionUser(request.getSession());
        }
    }

    public static void setSessionUser(HttpServletRequest request, UserDTO userDTO) {
        if ("database".equalsIgnoreCase(sessionType)) {
            setSessionUserFromDatabase(request, userDTO);
        } else {
            HttpSession session = request.getSession();
            session.setAttribute(SESSION_KEY, userDTO);
            session.setMaxInactiveInterval(SESSION_TIME);
        }
    }

    public static void clearSessionUser(HttpServletRequest request) {
        if ("database".equalsIgnoreCase(sessionType)) {
            clearSessionUserFromDatabase(request);
        } else {
            HttpSession session = request.getSession();
            session.removeAttribute(SESSION_KEY);
        }
    }
    
    private static String getSessionId(HttpSession session) {
        return (String) session.getAttribute(SESSION_KEY);
    }

    public static UserDTO getSessionUserFromDatabase(HttpServletRequest request) {
        HttpSession session = request.getSession();
        String sessionId = getSessionId(session);
        if(sessionId == null) {
            sessionId = generateSHA256Hash(request.getRemoteAddr() + SESSION_KEY);
        }

        UserEntity entity = sessionDAO.getSessionUser(sessionId);

        if (entity == null) return null;

        session.setAttribute(SESSION_KEY, sessionId);
        return UserDTO.builder()
                .userId(entity.getUserId())
                .userNo(entity.getUserNo())
                .grpId(entity.getGrpId())
                .userDesc(entity.getUserDesc())
                .runMode(RunMode.fromString(entity.getRunMode()).get())
                .userNm(entity.getUserNm())
                .build();
    }
    
    public static void setSessionUserFromDatabase(HttpServletRequest request, UserDTO userDTO) {
        HttpSession session = request.getSession();
        // String sessionId = UUID.randomUUID().toString();
        String sessionId = generateSHA256Hash(request.getRemoteAddr() + SESSION_KEY);

        UserEntity entity = sessionDAO.getSessionUserAll(sessionId);

        session.setAttribute(SESSION_KEY, sessionId);

        session.setMaxInactiveInterval(SESSION_TIME);

        UserSessionEntity userSession = UserSessionEntity.builder()
            .userId(userDTO.getUserId())
            .userNo(userDTO.getUserNo())
            .userSessionKey(sessionId)
            .accessIp(request.getRemoteAddr())
            .logType("LOGIN")
            .modUserNo(userDTO.getUserNo())
            .build();

        if (entity == null) {
            sessionDAO.saveSessionUser(userSession);
        } else {
            sessionDAO.updateSessionUser(userSession);
        }

        
    }

    public static void clearSessionUserFromDatabase(HttpServletRequest request) {
        HttpSession session = request.getSession();
        String sessionId = getSessionId(session);
        if (sessionId != null) {
            sessionDAO.deleteSessionUser(sessionId);
            session.removeAttribute(SESSION_KEY);
        }
    }

    public static void clearSessionUserSchedule() {
            sessionDAO.deleteSessionUserSchedule();
    }

    public static String generateSHA256Hash(String input) {
        return DigestUtils.sha256Hex(input);
    }

    public static void printSessionlog(HttpServletRequest request, String sessionIdHash) {
        String clientIp = request.getRemoteAddr();

        // User-Agent 헤더
        String userAgent = request.getHeader("User-Agent");

        // 세션 ID
        HttpSession session = request.getSession();
        String sessionId = session.getId();

        // 요청된 URI 및 URL
        String requestURI = request.getRequestURI();
        StringBuffer requestURL = request.getRequestURL();
        
        System.out.println("Client IP: " + clientIp);
        System.out.println("User-Agent: " + userAgent);
        System.out.println("Session ID: " + sessionId);
        System.out.println("Session ID HASH: " + sessionIdHash);
        System.out.println("Request URI: " + requestURI);
        System.out.println("Request URL: " + requestURL);
    }
}
