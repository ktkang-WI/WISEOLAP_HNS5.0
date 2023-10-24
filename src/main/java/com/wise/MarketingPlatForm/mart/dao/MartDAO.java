package com.wise.MarketingPlatForm.mart.dao;

import java.util.List;

import javax.annotation.Resource;
import org.springframework.stereotype.Repository;
import com.wise.MarketingPlatForm.mart.MartSqlSession;
import com.wise.MarketingPlatForm.mart.vo.MartResult;

@Repository
public class MartDAO {
	
	@Resource(name="martTemplates")
	MartSqlSession martSqlSession;
	
	public MartResult select(String query){
		List<Object> result = martSqlSession.sessionTemplate.selectList("Mart.select", query);
		return (MartResult) result.get(0);
	};

}
