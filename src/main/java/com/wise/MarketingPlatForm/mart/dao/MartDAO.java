package com.wise.MarketingPlatForm.mart.dao;

import java.util.List;

import javax.annotation.Resource;
import org.springframework.stereotype.Repository;
import com.wise.MarketingPlatForm.mart.MartSqlSession;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;

@Repository
public class MartDAO {
	
	@Resource(name="martTemplates")
	MartSqlSession martSqlSession;
	
	public MartResultDTO select(String query){
		List<Object> result = martSqlSession.sessionTemplate.selectList("Mart.select", query);
		return (MartResultDTO) result.get(0);
	}

	public MartResultDTO selectTalbe() {
		List<Object> result = martSqlSession.sessionTemplate.selectList("Mart.selectTable");
		return (MartResultDTO) result.get(0);
	}

	public MartResultDTO selectColumn() {
		List<Object> result = martSqlSession.sessionTemplate.selectList("Mart.selectColumn");
		return (MartResultDTO) result.get(0);
	};

}
