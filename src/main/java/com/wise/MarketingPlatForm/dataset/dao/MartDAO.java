package com.wise.MarketingPlatForm.dataset.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import org.springframework.stereotype.Repository;

import com.wise.MarketingPlatForm.global.config.mart.MartSqlSession;

@Repository
public class MartDAO {
	
	@Resource(name="martTemplates")
	MartSqlSession martSqlSession;
	
	public List<Map<String, Object>> selectList(String query){
		return martSqlSession.sessionTemplate.selectList("Mart.selectList", query);
	};

}
