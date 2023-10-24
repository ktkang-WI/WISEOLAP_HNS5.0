package com.wise.MarketingPlatForm.mart;

import java.util.HashMap;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Component;

@Component("martTemplates")
public class MartSqlSession {
	
	public SqlSessionTemplate sessionTemplate;
	public HashMap<Integer, SqlSessionTemplate> sessionTemplates;
	
	MartSqlSession(){
		this.sessionTemplates = new HashMap<Integer, SqlSessionTemplate>();
	}
	
}
