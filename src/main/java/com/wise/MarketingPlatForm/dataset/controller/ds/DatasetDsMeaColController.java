package com.wise.MarketingPlatForm.dataset.controller.ds;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.dataset.entity.DsViewMeaEntity;
import com.wise.MarketingPlatForm.dataset.service.ds.DatasetDsMeaService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "dataset-ds-col", description = "차원 컬럼을 관리합니다.")
@RestController
@RequestMapping("/dataset/ds/mea")
public class DatasetDsMeaColController {
  @Autowired
  private DatasetDsMeaService datasetDsMeaService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getDsViewDim(@RequestParam("cubeId") int cubeId) throws Exception{

    List<DsViewMeaEntity> model = datasetDsMeaService.getDatasetDsViewMea(cubeId);

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }
}
