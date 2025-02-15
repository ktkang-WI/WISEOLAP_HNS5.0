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
    // 테이블에 userNo가 있어도 false 반환 하는 경우가 있다고 하여, 먼저 테이블의 존재 여부를 조회
    // null 반환 경우도 있어 null 일 경우도 false 반환
    Boolean result = myPageConfigDAO.checkExistData(myDesignerDTO);
    if (result == null) {
      result = false;
    } 
    
    // 테이블에 존재 하지 않으면 insert, 존재 한다면 update
    if (!result.booleanValue()) {
      result = myPageConfigDAO.insertWbUserConfig(myDesignerDTO);
    } else {
      result = myPageConfigDAO.updataMyViewerConfig(myDesignerDTO);
    }
    
    return result;
  }
}
