package com.wise.MarketingPlatForm.config.controller.folder;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderReportDTO;
import com.wise.MarketingPlatForm.config.service.folder.ConfigFolderReportService;

import io.swagger.v3.oas.annotations.tags.Tag;

// TODO: 향후 개발
@Tag(name = "config-folder-group", description = "데이터원본을 관리합니다.")
@RestController
@RequestMapping("/config/folder-report")
public class ConfigFolderReportController {
  @Autowired
  private ConfigFolderReportService configFolderReportService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getConfigFolderReportData() throws Exception {

    List<ConfigFolderReportDTO> model = configFolderReportService.getConfigFolderReportData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }
}
