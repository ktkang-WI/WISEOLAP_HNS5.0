package com.wise.MarketingPlatForm.config.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.dto.myPage.MyDesignerDTO;

@Mapper
public interface MyPageConfigDAO {
  // My folder & report
  // public boolean updateMyReprot(MyPageFolderReportDTO myPageFolderReportDTO);
  // public boolean createMyFolder(MyPageFolderReportDTO myPageFolderReportDTO);
  // public boolean deleteMyFolder(List<Integer> data);
  // public boolean deleteChildReports(List<Integer> data);
  // public boolean updateMyFolder(MyPageFolderReportDTO myPageFolderReportDTO);
  // public List<FldMstrEntity> selectMyPageFolder(int userNo);
  // public int selectMyPageFolderCount(int userNo);
  // My designer property
  public MyDesignerDTO selectDesignerConfig(int userNo);
  public boolean updateDesignerConfig(MyDesignerDTO myDesignerDTO);
  public List<HashMap<String, String>> selectOnlyReportNm(int reportId);
  public String selectOnlyDatasetNm(int datasetId);
  public boolean insertDesignerConfig(MyDesignerDTO myDesignerDTO);
  // My User info
  public UserDTO selectUserInfo(int userNo);
  public String getPassword(int userNo);
  public boolean updatePassword(UserDTO userInfo);
  public boolean updateUserInfo(UserDTO user);
}
