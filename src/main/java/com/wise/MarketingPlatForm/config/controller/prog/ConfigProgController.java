package com.wise.MarketingPlatForm.config.controller.prog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.model.common.ProgModel;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.config.service.prog.ConfigProgService;

@RestController
@RequestMapping("/config/prog-list")
public class ConfigProgController {
  @Autowired
  private ConfigProgService configProgService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getConfigProgList() throws Exception {
    ProgModel model = configProgService.getDefaultProgModel();
    if (model == null) return RestAPIVO.conflictResponse(null);
    return RestAPIVO.okResponse(model);
  }
}
