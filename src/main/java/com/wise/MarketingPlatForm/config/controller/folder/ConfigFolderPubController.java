package com.wise.MarketingPlatForm.config.controller.folder;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.config.model.folder.ConfigFolderPubModel;
import com.wise.MarketingPlatForm.config.service.folder.configFolderPubService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "config-folder-pub", description = "공용 폴더 리스트를 가져옵니다.")
@RestController
@RequestMapping("/config/folder-pub")
public class ConfigFolderPubController {
  @Autowired
  private configFolderPubService configFolderPubService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getConfigFolderData() throws Exception {

    List<ConfigFolderPubModel> model = configFolderPubService.getConfigFolderPubData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  
  }
}
