package com.wise.MarketingPlatForm.dataset.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeActMstrEntity;
import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeDimColEntity;
import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeMeaColEntity;
import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeTblEntity;
import com.wise.MarketingPlatForm.dataset.vo.CubeTableColumn;
import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeMstrEntity;

@Mapper
public interface CubeDAO {
  public List<CubeMstrEntity> selectCubeList();

  public List<CubeMstrEntity> selectCubeListByDsViewId(String dsViewId);

  public List<CubeTblEntity> selectCubeDimTables(String cubeId);

  public List<CubeDimColEntity> selectCubeDimColumns(String cubeId);

  public List<CubeTblEntity> selectCubeMeaTables(String cubeId);

  public List<CubeMeaColEntity> selectCubeMeaColumns(String cubeId);

  public CubeTableColumn selectCubeColumnInfomationList(Map<String, String> param);

  public List<CubeActMstrEntity> selectDetailedData(String cubeId);
}
