package com.wise.MarketingPlatForm.dataset.controller.ds;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.dataset.entity.DsViewDimEntity;
import com.wise.MarketingPlatForm.dataset.service.ds.DataSetDsViewDimService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "dataset-ds-cube", description = "차원값을 관리합니다.")
@RestController
@RequestMapping("/dataset/ds/dim")
public class DataSetDsViewDimController {
  @Autowired
  private DataSetDsViewDimService dataSetDsViewDimService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getDs() throws Exception{

    List<DsViewDimEntity> model = dataSetDsViewDimService.getDatasetDsViewDim();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }
}
