package com.wise.MarketingPlatForm.dataset.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;
import com.wise.MarketingPlatForm.dataset.entity.DsViewEntity;

@Mapper
public interface DatasetDAO {
  public List<DsMstrEntity> selectGrpAuthDsList(String userId);

  public List<DsMstrEntity> selectUserAuthDsList(String userId);

  public List<DsViewEntity> selectGrpAuthDsViewList(String userId);

  public List<DsViewEntity> selectUserAuthDsViewList(String userId);

  public DsMstrEntity selectDataSource(int dsId);
}
