package com.wise.MarketingPlatForm.config.service.myPage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wise.MarketingPlatForm.config.dao.ConfigDAO;
import com.wise.MarketingPlatForm.config.dto.myPage.MyPageFolderReportDTO;
import com.wise.MarketingPlatForm.config.dto.myPage.MyPageFolderReportModel;

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
    ArrayList<MyPageFolderReportModel> reportListModelList = new ArrayList<MyPageFolderReportModel>();

    for (MyPageFolderReportDTO mypageFolder : myPageFolderReportDTO) {
      MyPageFolderReportModel myPageFolderReportModel = MyPageFolderReportModel.builder()
        .userNo(mypageFolder.getUserNo())
        .id(mypageFolder.getId())
        .name(mypageFolder.getName())
        .fldLvl(mypageFolder.getFldLvl())
        .ordinal(mypageFolder.getOrdinal())
        .fldParentId(mypageFolder.getFldParentId())
        .type(mypageFolder.getType())
        .subtitle(mypageFolder.getSubtitle())
        .tag(mypageFolder.getTag())
        .desc(mypageFolder.getDesc())
        .query(mypageFolder.getQuery())
        .createdDate(mypageFolder.getCreatedDate())
        .prompt(mypageFolder.getPrompt().equals("Y") ? true : false )
        .maxReportPeriodYn(mypageFolder.getMaxReportPeriodYn().equals("Y") ? true : false )
        .createdBy(mypageFolder.getCreatedBy())
        .ids(mypageFolder.getIds())
        .datasetXml(mypageFolder.getDatasetXml())
        .build();

        reportListModelList.add(myPageFolderReportModel);
    }
    int allDataLen = myPageFolderReportDTO.size();    
    // 개인보고서 조회 (보고서 정보에 사용.)
    result.put("folder", myPageFolderReportDTO.subList(allDataLen-fldCount, allDataLen));
    result.put("folderReport", reportListModelList);

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

  @Transactional
  public boolean deleteMyFolder(List<Integer> data) {
    boolean result = false;
    int count = configDAO.selectReportCountByFldId(data);
    result = configDAO.deleteMyFolder(data);
    if (count > 0) {
      result = configDAO.deleteChildReports(data);
    }

    return result;
  }

  public boolean updateMyFolder(MyPageFolderReportDTO myPageFolderReportDTO) {
    boolean result = false;
    result = configDAO.updateMyFolder(myPageFolderReportDTO);

    return result;
  }
}
