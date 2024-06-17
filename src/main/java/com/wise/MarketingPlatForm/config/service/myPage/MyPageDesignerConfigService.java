package com.wise.MarketingPlatForm.config.service.myPage;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.config.dao.MyPageConfigDAO;
import com.wise.MarketingPlatForm.config.dto.myPage.MyDesignerDTO;

@Service
public class MyPageDesignerConfigService {
  @Autowired
  MyPageConfigDAO myPageConfigDAO;

  public MyDesignerDTO getDesignerConfigData (int userNo) {
    return myPageConfigDAO.selectDesignerConfig(userNo);
  }

  public boolean saveDesignerConfig(MyDesignerDTO myDesignerDTO) {
    boolean result = false;
    
    result = myPageConfigDAO.updateDesignerConfig(myDesignerDTO);
    
    return result;
  };

  public boolean resetDesigner(MyDesignerDTO myDesignerDTO) {
    boolean result = false;
    result = myPageConfigDAO.updateDesignerConfig(myDesignerDTO);
    return result;
  }

  public String getOnlyReportName(int reportId) {
    return myPageConfigDAO.selectOnlyReportNm(reportId);
  }

  public String getOnlyDatasetName(int datasetId) {
    return myPageConfigDAO.selectOnlyDatasetNm(datasetId);
  }
}
