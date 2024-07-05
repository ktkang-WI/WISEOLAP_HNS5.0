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
    boolean result = myPageConfigDAO.updataMyViewerConfig(myDesignerDTO);
    
    // db에 테이블이 없는 경우 update 불가 -> insert 실행.
    if (!result) {
      result = myPageConfigDAO.insertWbUserConfig(myDesignerDTO);
    }
    
    return result;
  }
}
