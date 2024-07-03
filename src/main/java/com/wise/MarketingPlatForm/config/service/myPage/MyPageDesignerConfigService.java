package com.wise.MarketingPlatForm.config.service.myPage;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.config.controller.ConfigController;
import com.wise.MarketingPlatForm.config.dao.MyPageConfigDAO;
import com.wise.MarketingPlatForm.config.dto.myPage.MyDesignerDTO;

@Service
public class MyPageDesignerConfigService {
    private static final Logger logger = LoggerFactory.getLogger(ConfigController.class);

  @Autowired
  MyPageConfigDAO myPageConfigDAO;

  public MyDesignerDTO getDesignerConfigData (int userNo) {
    MyDesignerDTO model = null;
  
    try {
      model = myPageConfigDAO.selectDesignerConfig(userNo);
      if (model != null) {
        if (model.getDefaultReportId() != null) {
          List<HashMap<String, String>> reportNm = myPageConfigDAO.selectOnlyReportNm(model.getDefaultReportId().intValue());
          model.setDefaultReportNm(reportNm.get(0).get("REPORT_NM"));
          model.setDefaultReportType(reportNm.get(0).get("REPORT_TYPE"));
        }
    
        if (model.getDefaultDatasetId() != null) {
          String datasetNm = myPageConfigDAO.selectOnlyDatasetNm(model.getDefaultReportId().intValue());
          model.setDefaultDatasetNm(datasetNm);
        }
      }
    } catch (Exception e) {
      logger.error("MyPageDesignerConfigService Error", e);
    } finally {
      if (model == null) {
        model = MyDesignerDTO.builder()
        .userNo(userNo)
        .defaultDatasetId(null)
        .defaultReportId(null)
        .defaultItem("{\"item\":\"chart\",\"check\":false,\"layout\":\"CTGB\"}")
        .defaultPalette("")
        .defaultLayout("")
        .build();
      }
    }
  
    return model;
  }

  public boolean saveDesignerConfig(MyDesignerDTO myDesignerDTO) {
    boolean result = false;
    
    result = myPageConfigDAO.updateDesignerConfig(myDesignerDTO);
    if (!result) {
      result = myPageConfigDAO.insertDesignerConfig(myDesignerDTO);
    }

    return result;
  };

  public boolean resetDesigner(MyDesignerDTO myDesignerDTO) {
    boolean result = false;
    result = myPageConfigDAO.updateDesignerConfig(myDesignerDTO);
    return result;
  }
}
