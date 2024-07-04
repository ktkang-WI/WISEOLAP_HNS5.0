package com.wise.MarketingPlatForm.config.controller.myPage;

import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.dto.myPage.MyDesignerDTO;
import com.wise.MarketingPlatForm.config.service.myPage.MyPageViewerConfigService;
import com.wise.MarketingPlatForm.global.util.SessionUtility;

import io.swagger.v3.oas.annotations.tags.Tag;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;



@Tag(name = "my-page-viewer-config", description = "마이페이지 뷰어 설정")
@RestController
@RequestMapping("/mypage/my-page-viewer-config")
public class MyPageViewerConfigController {
  @Autowired
  MyPageViewerConfigService myPageViewerConfigService;

  @PostMapping("/save")
  public boolean saveMyViewerConfig(
    HttpServletRequest request,
    @RequestParam(required = false, defaultValue = "") Integer defaultViewerReportId,
    @RequestParam(required = false, defaultValue = "") String defaultViewerReportNm,
    @RequestParam(required = false, defaultValue = "") String reportType
  ) {
      UserDTO userDTO = SessionUtility.getSessionUser(request);

      int userNo = userDTO.getUserNo();

      MyDesignerDTO myDesignerDTO = MyDesignerDTO.builder()
        .userNo(userNo)
        .defaultViewerReportId(defaultViewerReportId)
        .defaultViewerReportNm(defaultViewerReportNm)
        .reportType(reportType)
        .build();

      return myPageViewerConfigService.updataMyViewerConfig(myDesignerDTO);
  }
}
