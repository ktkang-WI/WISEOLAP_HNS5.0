package com.wise.MarketingPlatForm.mart.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import org.springframework.stereotype.Repository;

import com.wise.MarketingPlatForm.mart.MartSqlSession;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;

@Repository
public class MartDAO {
	
	@Resource(name="martTemplates")
	MartSqlSession martSqlSession;
	
	public MartResultDTO select(String query){
		List<MartResultDTO> result = martSqlSession.sessionTemplate.selectList("Mart.select", query);
		
		return (MartResultDTO) result.get(0);
	}
	
	public MartResultDTO selectQueryDataTbl(Map<String, String> param){
		MartResultDTO result = martSqlSession.sessionTemplate.selectOne("Mart.selectQueryDataTbl", param);
		
		return result;
	}

	public MartResultDTO selectQueryDataCol(Map<String, String> param) {
		MartResultDTO result = martSqlSession.sessionTemplate.selectOne("Mart.selectQueryDataCol", param);
		
		return result;
	}
}
