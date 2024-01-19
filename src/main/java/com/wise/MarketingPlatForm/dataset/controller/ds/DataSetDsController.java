package com.wise.MarketingPlatForm.dataset.controller.ds;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;
import com.wise.MarketingPlatForm.dataset.service.ds.DatasetDsService;

@RestController
@RequestMapping("/dataset/ds")
public class DataSetDsController {
  
  @Autowired
  private DatasetDsService datasetDsService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getDs() throws Exception{

    List<DsMstrEntity> model = datasetDsService.getDatasetDsData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }
}
