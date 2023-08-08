package com.wise.MarketingPlatForm.domain.adom.application;

import org.springframework.stereotype.Service;

@Service
public interface AService{
	void login(String id, String pwd);

	void addmember(String id, String pwd);
}