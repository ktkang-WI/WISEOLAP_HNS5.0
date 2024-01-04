package com.wise.MarketingPlatForm.querygen.dao;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.querygen.dto.Relation;

@Mapper
public interface QuerygenDAO {
    List<Relation> selectCubeRelation(int cubeId);
}