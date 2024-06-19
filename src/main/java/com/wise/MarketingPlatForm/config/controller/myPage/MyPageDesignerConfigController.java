package com.wise.MarketingPlatForm.config.controller.myPage;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.controller.ConfigController;
import com.wise.MarketingPlatForm.config.dto.myPage.MyDesignerDTO;
import com.wise.MarketingPlatForm.config.service.myPage.MyPageDesignerConfigService;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;


@Tag(name = "my-page-designer-config", description = "마이페이지 디자이너 설정")
@RestController
@RequestMapping("/config/my-page-designer-config")
public class MyPageDesignerConfigController {
  @Autowired
  MyPageDesignerConfigService myPageDesignerConfig;
  
  @GetMapping
  public ResponseEntity<RestAPIVO> getDesignerConfig(HttpServletRequest request) throws Exception {
    HttpSession session = request.getSession();
    UserDTO userDTO = (UserDTO)session.getAttribute("WI_SESSION_USER");

    int userNo = userDTO.getUserNo();

    MyDesignerDTO model = myPageDesignerConfig.getDesignerConfigData(userNo); 
  
    return RestAPIVO.okResponse(model);
  } 
    
  @PostMapping  
  public boolean updateDesignerConfig(
    HttpServletRequest request,
    @RequestParam(required = false, defaultValue = "") Integer defaultDatasetId,
    @RequestParam(required = false, defaultValue = "") Integer defaultReportId,
    @RequestParam(required = false, defaultValue = "") String defaultItem,
    @RequestParam(required = false, defaultValue = "") String defaultPalette
  ) {
    HttpSession session = request.getSession();
    UserDTO userDTO = (UserDTO)session.getAttribute("WI_SESSION_USER");

    int userNo = userDTO.getUserNo();
    
    MyDesignerDTO myDesignerDTO = MyDesignerDTO.builder()
      .userNo(userNo)
      .defaultDatasetId(defaultDatasetId)
      .defaultReportId(defaultReportId)
      .defaultItem(defaultItem)
      .defaultPalette(defaultPalette)
      .build();
    boolean result = myPageDesignerConfig.saveDesignerConfig(myDesignerDTO);
    return result;
  };
  // 전체 항목 리셋
  @PostMapping("/reset")
  public boolean reset(HttpServletRequest request) {
    HttpSession session = request.getSession();
    UserDTO userDTO = (UserDTO)session.getAttribute("WI_SESSION_USER");

    int userNo = userDTO.getUserNo();
    MyDesignerDTO myDesignerDTO = MyDesignerDTO.builder()
    .userNo(userNo)
    .defaultDatasetId(null)
    .defaultReportId(null)
    .defaultItem(null)
    .defaultPalette(null)
    .build();
      return myPageDesignerConfig.resetDesigner(myDesignerDTO);
  }
  // 각 항목 리셋
}
