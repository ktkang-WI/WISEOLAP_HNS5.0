package com.wise.MarketingPlatForm.dataset.controller.ds;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.dataset.dto.ds.DatasetDsDTO;
import com.wise.MarketingPlatForm.dataset.service.ds.DatasetDsDsviewService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "dataset-ds", description = "데이터원본을 관리합니다.")
@RestController
@RequestMapping("/dataset/ds-dsview")
public class DatasetDsDsviewController {
  

@Autowired
  private DatasetDsDsviewService datasetDsDsviewService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getDs() throws Exception{

    List<DatasetDsDTO> model = datasetDsDsviewService.getDatasetDsDsviewData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

}
