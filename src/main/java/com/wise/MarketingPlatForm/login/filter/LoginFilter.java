package com.wise.MarketingPlatForm.login.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import com.wise.MarketingPlatForm.auth.type.RunMode;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.global.util.SessionUtility;

@Component
@WebFilter("/*")
public class LoginFilter implements Filter{
    Logger log = LoggerFactory.getLogger(this.getClass());

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
        UserDTO userDTO = SessionUtility.getSessionUser(request);

        log.debug("Request URI == > " + request.getRequestURI());
        log.debug("Session User Name == > " + (userDTO == null ? "null" : userDTO.getUserNm()));

        // 로그인 필터를 태우지 않을 URL 패턴
        String[] execludePatterns = {"/login/**", "/error", "/js/**", "/static/**",
            "/css/**", "/images/**", "/favicon.ico", "/index.html", "/swagger-ui/**",
            "/v3/api-docs/**", "/config/general", "/report/retrieve-link-report", "/linkviewer**"
        };

        boolean useFilter = true;

        for (String pattern : execludePatterns) {
            AntPathMatcher pathMatcher = new AntPathMatcher();

            if (pathMatcher.match(request.getContextPath() + pattern, request.getRequestURI())) {
                useFilter = false;
                break;
            }
        }

        if (!useFilter) {
            chain.doFilter(request, response);
            return;
        }
        // 로그인(contetxtRoot) 진입 시 동작
        if (request.getRequestURI().equals(request.getContextPath() + "/")) {
            if (userDTO != null) {
                // 세션 존재시 runMode 적용
                RunMode runMode = userDTO.getRunMode();

                if (runMode.equals(RunMode.ADMIN)) {
                    response.sendRedirect("dashany");
                } else {
                    response.sendRedirect("viewer");
                }
            } else {
                chain.doFilter(request, response);
            }
        // 그 외 동작
        } else if (userDTO == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } else {
            chain.doFilter(request, response);
        }
    }
}
