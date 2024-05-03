package com.wise.MarketingPlatForm.dataset.controller.ds;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;
import com.wise.MarketingPlatForm.dataset.service.ds.DataSetDsService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "dataset-ds", description = "데이터원본을 관리합니다.")
@RestController
@RequestMapping("/dataset/ds")
public class DataSetDsController {

  @Autowired
  private DataSetDsService datasetDsService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getDs() throws Exception{

    List<DsMstrEntity> model = datasetDsService.getDatasetDsData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

  @PostMapping
  public ResponseEntity<RestAPIVO> createDs(
    @RequestParam(required = true) String dsNm,
    @RequestParam(required = true) String ip,
    @RequestParam(required = true) String dbNm,
    @RequestParam(required = true) String dbmsType,
    @RequestParam(required = true) String ownerNm,
    @RequestParam(required = false, defaultValue = "") String connectorType,
    @RequestParam(required = true) String port,
    @RequestParam(required = true) String userId,
    @RequestParam(required = true) String password
  ) throws Exception{

    DsMstrEntity dsMstrEntity = DsMstrEntity.builder()
      .dsNm(dsNm)
      .ip(ip)
      .dbNm(dbNm)
      .dbmsType(dbmsType)
      .ownerNm(ownerNm)
      .connectorType(connectorType)
      .port(port)
      .userId(userId)
      .password(password)
      .build();

    boolean result = datasetDsService.createDs(dsMstrEntity);

    if (!result) return RestAPIVO.conflictResponse(false);

    return RestAPIVO.okResponse(true);
  }

  @PatchMapping
  public ResponseEntity<RestAPIVO> updateDs(
    @RequestParam(required = true) int dsId,
    @RequestParam(required = false, defaultValue = "") String dsNm,
    @RequestParam(required = false, defaultValue = "") String ip,
    @RequestParam(required = false, defaultValue = "") String dbNm,
    @RequestParam(required = false, defaultValue = "") String dbmsType,
    @RequestParam(required = false, defaultValue = "") String ownerNm,
    @RequestParam(required = false, defaultValue = "") String connectorType,
    @RequestParam(required = false, defaultValue = "") String port,
    @RequestParam(required = false, defaultValue = "") String userId,
    @RequestParam(required = false, defaultValue = "") String password
  ) throws Exception{

    DsMstrEntity dsMstrEntity = DsMstrEntity.builder()
      .dsId(dsId)
      .dsNm(dsNm)
      .ip(ip)
      .dbNm(dbNm)
      .dbmsType(dbmsType)
      .ownerNm(ownerNm)
      .connectorType(connectorType)
      .port(port)
      .userId(userId)
      .password(password)
      .build();

    boolean result = datasetDsService.updateDs(dsMstrEntity);

    if (!result) return RestAPIVO.conflictResponse(false);

    return RestAPIVO.okResponse(true);
  }

  @DeleteMapping
  public ResponseEntity<RestAPIVO> deleteDs(
    @RequestParam(required = true) int dsId
  ) throws Exception{

    DsMstrEntity dsMstrEntity = DsMstrEntity.builder()
      .dsId(dsId)
      .build();

    boolean result = datasetDsService.deleteDs(dsMstrEntity);

    if (!result) return RestAPIVO.conflictResponse(false);

    return RestAPIVO.okResponse(true);
  }
}