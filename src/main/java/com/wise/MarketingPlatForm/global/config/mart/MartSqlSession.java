package com.wise.MarketingPlatForm.global.config.mart;

import java.util.HashMap;
import java.util.Optional;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Component;
import com.wise.MarketingPlatForm.dataset.vo.DSMstrDTO;

@Component("martTemplates")
public class MartSqlSession {
	
	public SqlSessionTemplate sessionTemplate;
	public HashMap<Integer, SqlSessionTemplate> sessionTemplates;
	
	MartSqlSession(){
		this.sessionTemplates = new HashMap<Integer, SqlSessionTemplate>();
	}
	
}
