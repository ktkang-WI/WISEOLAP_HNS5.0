package com.wise.MarketingPlatForm.dataset.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.dataset.entity.DSMstrEntity;

@Mapper
public interface DatasetDAO {
  public List<DSMstrEntity> selectGrpAuthDsList(String userId);

  public List<DSMstrEntity> selectUserAuthDsList(String userId);
}
