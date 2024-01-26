package com.wise.MarketingPlatForm.domain.adom.api;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.wise.MarketingPlatForm.domain.adom.application.AService;


@Controller
public class AController {

	private AService AService;

//	@RequestMapping(value = {"/login.do"})
//    public void login(HttpServletRequest request, HttpServletResponse response, Model model){
//			String id = "admin";
//			String pwd = "Wise1012!@#$";
//			AService.login(id,pwd);
//    }
    
//	@RequestMapping(value = {"/logout.do"})
//    public void logout(Long orderId){
//            loginService.logout(orderId);
//    }
    
	@RequestMapping(value = {"/addMember.do"})
    public void addMember(HttpServletRequest request, HttpServletResponse response){
		
			String id = "shlim";
			String pwd = "1234";
			AService.addmember(id,pwd);
    }
	
}



