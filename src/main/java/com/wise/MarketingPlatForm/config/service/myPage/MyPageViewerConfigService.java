package com.wise.MarketingPlatForm.config.service.myPage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.config.dao.MyPageConfigDAO;
import com.wise.MarketingPlatForm.config.dto.myPage.MyDesignerDTO;

@Service
public class MyPageViewerConfigService {
  @Autowired
  MyPageConfigDAO myPageConfigDAO;

  public boolean updataMyViewerConfig(MyDesignerDTO myDesignerDTO) {
    boolean result = false;
    
    result = myPageConfigDAO.saveMyViewerConfig(myDesignerDTO);
    
    if (!result) {
      result = myPageConfigDAO.insertDesignerConfig(myDesignerDTO);
    }
    
    return result;
  }
}
