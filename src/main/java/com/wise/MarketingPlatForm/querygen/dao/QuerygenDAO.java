package com.wise.MarketingPlatForm.querygen.dao;


import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.dataset.vo.CubeTableColumn;
import com.wise.MarketingPlatForm.querygen.dto.Relation;

@Mapper
public interface QuerygenDAO {
    List<Relation> selectCubeRelation(int cubeId);

    List<Relation> selectDsViewRelation(Map<String, Object> viewRelParam);

    List<CubeTableColumn> selectColumnInfomationList(Map<String, Object> colInfoParam);
    
}