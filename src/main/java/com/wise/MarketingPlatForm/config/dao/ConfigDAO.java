package com.wise.MarketingPlatForm.config.dao;

import java.util.ArrayList;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderDTO;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderDatasetDTO;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderReportDTO;
import com.wise.MarketingPlatForm.config.dto.myPage.MyPageFolderReportDTO;
import com.wise.MarketingPlatForm.config.entity.ConfigMstrEntity;
import com.wise.MarketingPlatForm.config.entity.FldMstrEntity;
import com.wise.MarketingPlatForm.config.entity.WbConfigMstrEntity;
import com.wise.MarketingPlatForm.config.model.folder.ConfigFolderPubModel;

@Mapper
public interface ConfigDAO {
  public boolean updateConfig(ConfigMstrEntity configMstr);
  public boolean updateWbConfig(WbConfigMstrEntity wbConfigMstr);
  public List<ConfigFolderDTO> selectConfigFolderGroup();
  public List<ConfigFolderDatasetDTO> selectConfigFolderDataset();
  public List<UserDTO> selectUserList();
  public UserDTO selectUserByUserNo(int userNo);
  public List<FldMstrEntity> selectConfigFolder();
  public List<ConfigFolderReportDTO> selectConfigPrivateFolderReport(int userNo);
  public List<ConfigFolderReportDTO> selectConfigPrivateFolders(int userNo);
  public List<ConfigFolderPubModel> selectConfigPubFolder();
  public List<ConfigFolderReportDTO> selectConfigFolders();
  public List<ConfigFolderReportDTO> selectConfigFolderReport();
  public boolean createConfigFolder(FldMstrEntity fldMstrEntity);
  public boolean updateConfigFolder(FldMstrEntity fldMstrEntity);
  public boolean deleteConfigFolder(FldMstrEntity fldMstrEntity);
  // myPage 이동 에정
  public ArrayList<MyPageFolderReportDTO> selectMyPageFolderReport(int userNo, String userNm);
  public boolean updateMyReprot(MyPageFolderReportDTO myPageFolderReportDTO);
  public boolean createMyFolder(MyPageFolderReportDTO myPageFolderReportDTO);
  public boolean deleteMyFolder(List<Integer> data);
  public boolean deleteChildReports(List<Integer> data);
  public int selectReportCountByFldId(List<Integer> data);
  public boolean updateMyFolder(MyPageFolderReportDTO myPageFolderReportDTO);
  public List<FldMstrEntity> selectMyPageFolder(int userNo);
  public int selectMyPageFolderCount(int userNo);
}
