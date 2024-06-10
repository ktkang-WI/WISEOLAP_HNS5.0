package com.wise.MarketingPlatForm.config.service.myPage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.config.dao.ConfigDAO;
import com.wise.MarketingPlatForm.config.dto.myPage.MyPageFolderReportDTO;

@Service
public class MyPageFolderReportService {
  @Autowired
  ConfigDAO configDAO;

  public Map<String, Object> getMypageFolderReportData(int userNo, String userNm) {
    Map<String, Object> result = new HashMap<>();
    // 개인 폴더 갯수만.
    int fldCount = configDAO.selectMyPageFolderCount(userNo);
    // 개인 폴더 및 개인 보고서 전체 조회
    ArrayList<MyPageFolderReportDTO> myPageFolderReportDTO = configDAO.selectMyPageFolderReport(userNo, userNm);
    // 개인보고서 조회 (보고서 정보에 사용.)
    result.put("folder", myPageFolderReportDTO.subList(0, fldCount));
    result.put("folderReport", myPageFolderReportDTO);


    return result;
  }

  public boolean updateMyReport(MyPageFolderReportDTO myPageFolderReportDTO) {
    boolean result = false;
    result = configDAO.updateMyReprot(myPageFolderReportDTO);

    return result;
  }

  public boolean createMyFolder(MyPageFolderReportDTO myPageFolderReportDTO) {
    boolean result = false;
    result = configDAO.createMyFolder(myPageFolderReportDTO);

    return result;
  }

  public boolean deleteMyFolder(List<Integer> data) {
    boolean result = false;
    result = configDAO.deleteMyFolder(data);
    result = configDAO.deleteChildReports(data);

    return result;
  }

  public boolean updateMyFolder(MyPageFolderReportDTO myPageFolderReportDTO) {
    boolean result = false;
    result = configDAO.updateMyFolder(myPageFolderReportDTO);

    return result;
  }
}
