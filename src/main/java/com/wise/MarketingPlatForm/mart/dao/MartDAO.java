package com.wise.MarketingPlatForm.mart.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import org.springframework.stereotype.Repository;

import com.wise.MarketingPlatForm.mart.MartSqlSession;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;

@Repository
public class MartDAO {

    @Resource(name = "martTemplates")
    MartSqlSession martSqlSession;

    public MartResultDTO select(Integer dsId, String query) {
        List<MartResultDTO> result = martSqlSession.sessionTemplates.get(dsId).selectList("Mart.select", query);
        return (MartResultDTO) result.get(0);
    }

    public MartResultDTO selectQueryDataTbl(Integer dsId, Map<String, String> param) {
        MartResultDTO result = martSqlSession.sessionTemplates.get(dsId).selectOne("Mart.selectQueryDataTbl", param);
        return result;
    }

    public MartResultDTO selectQueryDataCol(Integer dsId, Map<String, String> param) {
        MartResultDTO result = martSqlSession.sessionTemplates.get(dsId).selectOne("Mart.selectQueryDataCol", param);
        return result;
    }
}
