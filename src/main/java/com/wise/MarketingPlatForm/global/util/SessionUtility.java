package com.wise.MarketingPlatForm.global.util;

import java.util.Enumeration;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.auth.entity.UserEntity;
import com.wise.MarketingPlatForm.auth.service.AuthService;
import com.wise.MarketingPlatForm.auth.type.RunMode;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.global.session.dao.SessionDAO;
import com.wise.MarketingPlatForm.global.session.entity.UserSessionEntity;

import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class SessionUtility {
    private static final Logger log= LoggerFactory.getLogger(SessionUtility.class);

    @Autowired
    private static SessionDAO sessionDAO;
    private static AuthService authService;

    private static String sessionType;

    @Value("${session.type}")
    private String configSessionType;

    public SessionUtility(SessionDAO sessionDAO, AuthService authService) {
        SessionUtility.sessionDAO = sessionDAO;
        SessionUtility.authService = authService;
    }
    @PostConstruct
    private void init() {
        SessionUtility.sessionType = this.configSessionType;
    }
    
    private final static String SESSION_KEY = "WI_SESSION_USER";
    private final static String SESSION_KEY_DB_ID = "WI_SESSION_USER_DB_ID";

    private final static String SSO_ID_KEY = "SSO_ID";
    private final static int SESSION_TIME = 60 * 60 * 8;


    private static UserDTO getSessionUser(HttpSession session) {
        return (UserDTO)session.getAttribute(SESSION_KEY);
    }
    

    public static UserDTO getSessionUser(HttpSessionEvent request) {
        return getSessionUser(request.getSession());
    }
    public static UserDTO getSessionSSO(HttpServletRequest request) {
        String ssUserId =  (String) request.getSession().getServletContext().getContext("/").getAttribute(SSO_ID_KEY);
        

        UserDTO userDTO = null;
        try {
            if(ssUserId == null || "".equals(ssUserId)){
                userDTO = getSessionUser(request.getSession());

                if(userDTO == null) {
                    if ("database".equalsIgnoreCase(sessionType)) {
                        userDTO = getSessionUserFromDatabase(request);
                    }
                }
            } else {
                userDTO = authService.getUserById(ssUserId);
                if(userDTO != null) {
                    setSessionUser(request, userDTO);
                    request.getSession().getServletContext().getContext("/").setAttribute(SSO_ID_KEY, null);
                }
            }
        } catch(Exception e) {
            System.out.println("Sesssion Utility ERROR : " + e.getMessage() + " : " + e);
        } finally {
            request.getSession().getServletContext().getContext("/").setAttribute(SSO_ID_KEY, null);
        }
        return userDTO;
    }
    public static UserDTO getSessionUser(HttpServletRequest request) { 
        if ("database".equalsIgnoreCase(sessionType)) {
            UserDTO sessionUser = getSessionUser(request.getSession());
            if(sessionUser == null) {
                sessionUser = getSessionSSO(request);
            }

            if(sessionUser == null) {
                sessionUser = getSessionUserFromDatabase(request);
            }
            return sessionUser;
        } else {
            // return getSessionUser(request.getSession());
            UserDTO sessionUser = getSessionUser(request.getSession());
            if(sessionUser == null) {
                sessionUser = getSessionSSO(request);
            }
            return sessionUser;
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
        return (String) session.getAttribute(SESSION_KEY_DB_ID);
    }

    public static UserDTO getSessionUserFromDatabase(HttpServletRequest request) {
        HttpSession session = request.getSession();
        String sessionId = getSessionId(session);
        if(sessionId == null) {
            sessionId = generateSHA256Hash(request.getRemoteAddr() + SESSION_KEY_DB_ID);
        }

        UserEntity entity = sessionDAO.getSessionUser(sessionId);

        if (entity == null) return null;

        session.setAttribute(SESSION_KEY_DB_ID, sessionId);
        return UserDTO.builder()
                .userId(entity.getUserId())
                .userNo(entity.getUserNo())
                .grpId(entity.getGrpId())
                .userDesc(entity.getUserDesc())
                .runMode(RunMode.fromString(entity.getRunMode()).get())
                .userNm(entity.getUserNm())
                .sessionUserKey(sessionId)
                .build();
    }
    
    public static void setSessionUserFromDatabase(HttpServletRequest request, UserDTO userDTO) {
        HttpSession session = request.getSession();
        // String sessionId = UUID.randomUUID().toString();
        String sessionId = generateSHA256Hash(request.getRemoteAddr() + SESSION_KEY_DB_ID);

        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getRemoteAddr();
        }
        System.out.println("Request IP: " + request.getRemoteAddr());
        System.out.println("Client IP: " + clientIp);

        UserEntity entity = sessionDAO.getSessionUserAll(sessionId);

        session.setAttribute(SESSION_KEY_DB_ID, sessionId);

        session.setAttribute(SESSION_KEY, userDTO);
        session.setMaxInactiveInterval(SESSION_TIME);

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
