package com.wise.MarketingPlatForm.config.controller.folder;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderReportDTO;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderReportModel;
import com.wise.MarketingPlatForm.config.service.folder.ConfigFolderReportService;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestParam;


// TODO: 향후 개발
@Tag(name = "config-folder-group", description = "데이터원본을 관리합니다.")
@RestController
@RequestMapping("/config/folder-report")
public class ConfigFolderReportController {
  @Autowired
  private ConfigFolderReportService configFolderReportService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getConfigFolderReportData() throws Exception {

    List<ConfigFolderReportDTO> configFolderReportDtoList = configFolderReportService.getConfigFolderReportData();
    List<ConfigFolderReportModel> model = new ArrayList<ConfigFolderReportModel>();

    for (ConfigFolderReportDTO configFolderReportDTO : configFolderReportDtoList) {
      ConfigFolderReportModel configFolderReportModel = ConfigFolderReportModel.builder()
      .fldId(configFolderReportDTO.getFldId())
      .fldNm(configFolderReportDTO.getFldNm())
      .fldLvl(configFolderReportDTO.getFldLvl())
      .fldParentId(configFolderReportDTO.getFldParentId())
      .fldOrdinal(configFolderReportDTO.getFldOrdinal())
      .reportId(configFolderReportDTO.getReportId())
      .reportNm(configFolderReportDTO.getReportNm())
      .reportSubTitle(configFolderReportDTO.getReportSubTitle())
      .userId(configFolderReportDTO.getUserId())
      .regDt(configFolderReportDTO.getRegDt()) // 게시일자
      .regUserNm(configFolderReportDTO.getRegUserNm()) // 게시자
      .modDt(configFolderReportDTO.getModDt()) //최종 수정 일자
      .modUserNm(configFolderReportDTO.getModUserNm()) // 최종 수정자
      .requester(configFolderReportDTO.getRequester()) // 요청자
      .reportTag(configFolderReportDTO.getReportTag())
      .reportOrdinal(configFolderReportDTO.getReportOrdinal())
      .reportDesc(configFolderReportDTO.getReportDesc())
      .reportType(configFolderReportDTO.getReportType())
      .promptYn(configFolderReportDTO.getPromptYn().equals("Y") ? true : false)
      .maxReportPeriodYn(configFolderReportDTO.getMaxReportPeriodYn().equals("Y") ? true : false)
      .isCube(configFolderReportDTO.isCube())
      .build();

      model.add(configFolderReportModel);
    }

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }
  
  @GetMapping("/userList")
  public ResponseEntity<RestAPIVO> getUserList() {
    List<UserDTO> configFolderReportDtoList = configFolderReportService.getUserList();
    
    if (configFolderReportDtoList == null) return RestAPIVO.conflictResponse(null);
    return RestAPIVO.okResponse(configFolderReportDtoList);
  }

  @GetMapping("/private")
  public ResponseEntity<RestAPIVO> getPrivateFolderReport(
    @RequestParam(required = true) int userNo
  ) {
    
    List<ConfigFolderReportDTO> configFolderReportDtoList = configFolderReportService.getConfigPrivateFolderReportData(userNo);
    List<ConfigFolderReportModel> model = new ArrayList<ConfigFolderReportModel>();

    for (ConfigFolderReportDTO configFolderReportDTO : configFolderReportDtoList) {
      ConfigFolderReportModel configFolderReportModel = ConfigFolderReportModel.builder()
      .fldId(configFolderReportDTO.getFldId())
      .fldNm(configFolderReportDTO.getFldNm())
      .fldLvl(configFolderReportDTO.getFldLvl())
      .fldParentId(configFolderReportDTO.getFldParentId())
      .fldOrdinal(configFolderReportDTO.getFldOrdinal())
      .reportId(configFolderReportDTO.getReportId())
      .reportNm(configFolderReportDTO.getReportNm())
      .reportSubTitle(configFolderReportDTO.getReportSubTitle())
      .userId(configFolderReportDTO.getUserId())
      .regDt(configFolderReportDTO.getRegDt())
      .reportTag(configFolderReportDTO.getReportTag())
      .reportOrdinal(configFolderReportDTO.getReportOrdinal())
      .reportDesc(configFolderReportDTO.getReportDesc())
      .reportType(configFolderReportDTO.getReportType())
      .promptYn(configFolderReportDTO.getPromptYn().equals("Y") ? true : false)
      .build();

      model.add(configFolderReportModel);
    }
    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }
}
