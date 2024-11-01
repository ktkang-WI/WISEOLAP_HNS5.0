package com.wise.MarketingPlatForm.login.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import com.wise.MarketingPlatForm.auth.service.AuthService;
import com.wise.MarketingPlatForm.auth.type.RunMode;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.dto.myPage.MyDesignerDTO;
import com.wise.MarketingPlatForm.config.service.myPage.MyPageDesignerConfigService;
import com.wise.MarketingPlatForm.fileUpload.store.token.TokenStorage;
import com.wise.MarketingPlatForm.global.util.SessionUtility;
import com.wise.MarketingPlatForm.report.vo.ReportTokenDTO;

@Component
//@WebFilter("/*")
public class LoginFilter implements Filter{
    Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private AuthService authService;

    @Autowired
    MyPageDesignerConfigService myPageDesignerConfig;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req; 
        HttpServletResponse response = (HttpServletResponse) res; 
        // UserDTO userDTO = SessionUtility.getSessionUser(request);
        UserDTO userDTO = SessionUtility.getSessionSSO(request);

        // 로그인 필터를 태우지 않을 URL 패턴
        String[] execludePatterns = {"/login/**", "/error", "/js/**", "/static/**",
            "/css/**", "/images/**", "/favicon.ico", "/index.html", "/swagger-ui/**",
            "/v3/api-docs/**", "/config/general", "/report/retrieve-link-report", "/linkviewer**",
            "/sso/inc/sessionView.jsp", "/mypage/user-info/update-password"
        };

        boolean useFilter = true;

        for (String pattern : execludePatterns) {
            AntPathMatcher pathMatcher = new AntPathMatcher();

            if (pathMatcher.match(request.getContextPath() + pattern, request.getRequestURI())) {
                useFilter = false;
                break;
            }
        }

        String token = request.getParameter("token");
        if (token != null && !token.isEmpty()) {
            TokenStorage<ReportTokenDTO> tokenStorage = new TokenStorage<>("report", ReportTokenDTO.class);

            ReportTokenDTO tokenDTO = tokenStorage.getValue(token);

            userDTO = authService.getUserById(tokenDTO.getUserId());

            SessionUtility.setSessionUser(request, userDTO);
        }

        String userId = request.getParameter("userId");

        try {
            if ((request.getRequestURI().indexOf("/config/general") >= 0
                 || request.getRequestURI().indexOf("linkviewer") >= 0) 
                && userId != null && !userId.trim().isEmpty()
            ) {
                userDTO = authService.getUserById(userId);
    
                SessionUtility.setSessionUser(request, userDTO);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            log.error("failed login user === > user ID: " + userId);
            e.printStackTrace();
        }


        if (!useFilter) {
            chain.doFilter(request, response);
            return;
        }

        boolean isCallCenterGrp = userDTO != null && userDTO.getGrpId() == 1503;
        isCallCenterGrp = isCallCenterGrp && request.getRequestURI().indexOf("/portal") >= 0;

        // 로그인(contetxtRoot) 진입 시 동작
        if (request.getRequestURI().equals(request.getContextPath() + "/") || isCallCenterGrp) {
            if (userDTO != null) {
                // 세션 존재시 runMode 적용
                RunMode runMode = userDTO.getRunMode();

                response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                response.setHeader("Pragma", "no-cache");
                response.setDateHeader("Expires", 0);

                if (runMode.equals(RunMode.ADMIN)) {
                    int userNo = userDTO.getUserNo();
                    MyDesignerDTO myDesigner = myPageDesignerConfig.getDesignerConfigData(userNo);
                    String defaultItemString = myDesigner.getDefaultItem();

                    JSONObject jsonObject = new JSONObject(defaultItemString);

                    String redirectPage = ((String) jsonObject.get("initDisplay")).toLowerCase();

                    response.sendRedirect(redirectPage);
                } else {
                    response.sendRedirect("viewer");
                }
            } else {
                chain.doFilter(request, response);
            }
        // 그 외 동작
        } else if (userDTO == null) {
            response.sendRedirect("/editds");
            // response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            log.info("LoginFilter, userDTO is null");
        } else {
            chain.doFilter(request, response);
        }
    }
}
