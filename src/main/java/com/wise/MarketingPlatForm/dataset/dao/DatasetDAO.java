package com.wise.MarketingPlatForm.dataset.dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.dataset.dto.ds.DatasetDsDTO;
import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;
import com.wise.MarketingPlatForm.dataset.entity.DsViewDimEntity;
import com.wise.MarketingPlatForm.dataset.entity.DsViewEntity;
import com.wise.MarketingPlatForm.dataset.entity.UserUploadMstrEntity;
import com.wise.MarketingPlatForm.dataset.entity.DsViewTableEntity;

@Mapper
public interface DatasetDAO {
  public List<DsMstrEntity> selectGrpAuthDsList(String userId);

  public List<DsMstrEntity> selectUserAuthDsList(String userId);

  public List<DsViewEntity> selectGrpAuthDsViewList(String userId);

  public List<DsViewEntity> selectUserAuthDsViewList(String userId);
  
  public DsMstrEntity selectDataSource(int dsId);

  public List<DsMstrEntity> selectDatasetDs();

  public List<DatasetDsDTO> selectDatasetDsDsview();

  public List<DsViewTableEntity> selectDsViewTables(String dsViewId);
  
  public boolean deleteDs(DsMstrEntity dsMstrEntity);
  
  public boolean updateDs(DsMstrEntity dsMstrEntity);
  
  public boolean createDs(DsMstrEntity dsMstrEntity);
  
  public List<UserUploadMstrEntity> selectUserUploadTables(int dsId);

  public List<DsViewDimEntity> selectDatasetDsViewDim();

}
