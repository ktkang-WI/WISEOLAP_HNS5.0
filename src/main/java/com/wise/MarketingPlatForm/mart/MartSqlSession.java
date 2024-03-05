package com.wise.MarketingPlatForm.mart;

import java.util.HashMap;
import java.util.Map;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Component;

@Component("martTemplates")
public class MartSqlSession {
	
	public Map<Integer, SqlSessionTemplate> sessionTemplates;
	
	MartSqlSession(){
		this.sessionTemplates = new HashMap<Integer, SqlSessionTemplate>();
	}
	
}



