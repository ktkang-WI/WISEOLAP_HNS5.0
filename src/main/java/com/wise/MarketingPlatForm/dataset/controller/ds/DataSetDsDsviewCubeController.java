package com.wise.MarketingPlatForm.dataset.controller.ds;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.dataset.model.DatasetDsDsviewCubeModel;
import com.wise.MarketingPlatForm.dataset.service.ds.DatasetDsDsviewCubeService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "dataset-ds", description = "데이터원본을 관리합니다.")
@RestController
@RequestMapping("/dataset/ds/dsview-cube")
public class DataSetDsDsviewCubeController {
  
  @Autowired
  private DatasetDsDsviewCubeService datasetDsDsviewCubeService;
  
  @GetMapping
  public ResponseEntity<RestAPIVO> getDs() throws Exception{

    List<DatasetDsDsviewCubeModel> model =
      datasetDsDsviewCubeService.getDatasetDsDsviewCube();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

}
