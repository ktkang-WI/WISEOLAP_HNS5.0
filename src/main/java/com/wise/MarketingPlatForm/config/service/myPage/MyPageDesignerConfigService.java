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
          HashMap<String, String> reportNm = myPageConfigDAO.selectOnlyReportNm(model.getDefaultReportId().intValue());
          model.setDefaultReportNm(reportNm.get("reportNm"));
          model.setDefaultReportType(reportNm.get("reportType"));
        }
        
        if (model.getDefaultViewerReportId() != null) {
          HashMap<String, String> reportNm = myPageConfigDAO.selectOnlyReportNm(model.getDefaultViewerReportId().intValue());
          model.setDefaultViewerReportNm(reportNm.get("reportNm"));
          model.setReportType(reportNm.get("reportType"));
        }
        // TODO : 기본 데이터집합은 사용안하지만 추후 추가될 가능성 있음.
        // if (model.getDefaultDatasetId() != null) {
        //   String datasetNm = myPageConfigDAO.selectOnlyDatasetNm(model.getDefaultReportId().intValue());
        //   model.setDefaultDatasetNm(datasetNm);
        // }
      }
    } catch (Exception e) {
      logger.error("MyPageDesignerConfigService Error", e);
    } finally {
      if (model == null) {
        String defaultLayouts = "{\"item\":\"chart\",\"check\":true,\"layout\":\"CTGB\",\"displayCheck\":false,\"initDisplay\":\"dashAny\"}";
        model = MyDesignerDTO.builder()
        .userNo(userNo)
        .defaultDatasetId(null)
        .defaultReportId(null)
        .defaultItem(defaultLayouts)
        .defaultPalette("")
        .defaultLayout("")
        .defaultViewerReportId(null)
        .defaultViewerReportNm("")
        .build();
      }
    }
  
    return model;
  }

  public boolean saveDesignerConfig(MyDesignerDTO myDesignerDTO) {
    // 테이블에 userNo가 있어도 false 반환 하는 경우가 있다고 하여, 먼저 테이블의 존재 여부를 조회
    Boolean result = myPageConfigDAO.checkExistData(myDesignerDTO);
    if (result == null) {
      result = false;
    } 

    // 테이블에 존재 하지 않으면 insert, 존재 한다면 update
    if (!result.booleanValue()) {
      result = myPageConfigDAO.insertWbUserConfig(myDesignerDTO);
    } else {
      result = myPageConfigDAO.updateDesignerConfig(myDesignerDTO);
    }

    return result;
  };

  public boolean resetDesigner(MyDesignerDTO myDesignerDTO) {
    boolean result = myPageConfigDAO.updateDesignerConfig(myDesignerDTO);
    
    return result;
  }
}
