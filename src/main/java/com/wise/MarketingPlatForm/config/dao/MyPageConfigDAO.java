package com.wise.MarketingPlatForm.config.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.config.dto.myPage.MyDesignerDTO;
import com.wise.MarketingPlatForm.config.dto.myPage.MyPageFolderReportDTO;
import com.wise.MarketingPlatForm.config.entity.FldMstrEntity;

@Mapper
public interface MyPageConfigDAO {
  // public boolean updateMyReprot(MyPageFolderReportDTO myPageFolderReportDTO);
  // public boolean createMyFolder(MyPageFolderReportDTO myPageFolderReportDTO);
  // public boolean deleteMyFolder(List<Integer> data);
  // public boolean deleteChildReports(List<Integer> data);
  // public boolean updateMyFolder(MyPageFolderReportDTO myPageFolderReportDTO);
  // public List<FldMstrEntity> selectMyPageFolder(int userNo);
  // public int selectMyPageFolderCount(int userNo);
  public MyDesignerDTO selectDesignerConfig(int userNo);
  public boolean updateDesignerConfig(MyDesignerDTO myDesignerDTO);
  public String selectOnlyReportNm(int reportId);
  public String selectOnlyDatasetNm(int datasetId);
  public boolean insertDesignerConfig(MyDesignerDTO myDesignerDTO);
}
