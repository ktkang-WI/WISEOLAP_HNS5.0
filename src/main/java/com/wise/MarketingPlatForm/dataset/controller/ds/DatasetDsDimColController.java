package com.wise.MarketingPlatForm.dataset.controller.ds;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.dataset.entity.DsViewColEntity;
import com.wise.MarketingPlatForm.dataset.service.ds.DatasetDsColService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "dataset-ds-col", description = "차원 컬럼을 관리합니다.")
@RestController
@RequestMapping("/dataset/ds/col")
public class DatasetDsDimColController {
  @Autowired
  private DatasetDsColService dataSetDsViewColService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getDsViewDim(@RequestParam("dsViewId") int dsViewId) throws Exception{

    List<DsViewColEntity> model = dataSetDsViewColService.getDatasetDsViewCol(dsViewId);

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }
}
