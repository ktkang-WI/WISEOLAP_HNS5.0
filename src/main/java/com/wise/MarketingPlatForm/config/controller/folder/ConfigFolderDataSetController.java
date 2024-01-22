package com.wise.MarketingPlatForm.config.controller.folder;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderDatasetDTO;
import com.wise.MarketingPlatForm.config.service.folder.ConfigFolderDatasetService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "config-folder-dataset", description = "데이터원본을 관리합니다.")
@RestController
@RequestMapping("/config/folder/dataset")
public class ConfigFolderDatasetController {
  
  @Autowired
  private ConfigFolderDatasetService configFolderDatasetService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getConfigFolderDatasetData() throws Exception {

    List<ConfigFolderDatasetDTO> model = configFolderDatasetService.getConfigFolderDatasetData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }


}
