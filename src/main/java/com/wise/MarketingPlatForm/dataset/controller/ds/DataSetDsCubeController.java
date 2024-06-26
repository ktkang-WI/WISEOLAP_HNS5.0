package com.wise.MarketingPlatForm.dataset.controller.ds;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeMstrEntity;
import com.wise.MarketingPlatForm.dataset.service.CubeService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "dataset-ds-cube", description = "주제영역을 관리합니다.")
@RestController
@RequestMapping("/dataset/ds/cube")
public class DataSetDsCubeController {

  @Autowired
  private CubeService cubeService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getDs() throws Exception{

    List<CubeMstrEntity> model = cubeService.getCubes();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }
  
}
