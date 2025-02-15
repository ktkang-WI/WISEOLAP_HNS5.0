package com.wise.MarketingPlatForm.config.controller.myPage;

import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.dto.myPage.MyPageFolderReportDTO;
import com.wise.MarketingPlatForm.config.service.myPage.MyPageFolderReportService;
import com.wise.MarketingPlatForm.global.util.SessionUtility;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@Tag(name = "my-page-folder", description = "마이페이지에 개인폴더 및 보고서 리스트를 가져옵니다.")
@RestController
@RequestMapping("/config/my-page-folder")
public class MyPageFolderController {
  @Autowired
  MyPageFolderReportService myPageFolderReportService;

  @GetMapping
  public ResponseEntity<RestAPIVO> getMypageFolderData(HttpServletRequest request) throws Exception {
    UserDTO userDTO = SessionUtility.getSessionUser(request);

    int userNo = userDTO.getUserNo();
    String userNm = userDTO.getUserId();
    //hashmap
    Map<String, Object> model = myPageFolderReportService.getMypageFolderReportData(userNo, userNm);

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  }

  @PatchMapping
  public ResponseEntity<RestAPIVO> updateMyReport(
    @RequestBody Map<String, String> param
  ) {
    Gson gson = new Gson();
    String strPrompt = param.get("prompt").equals("true") ? "Y" : "N";
    String strMaxReportPeriodYn = param.get("maxReportPeriodYn").equals("true") ? "Y" : "N";
    
    param.put("prompt", strPrompt);
    param.put("maxReportPeriodYn", strMaxReportPeriodYn);

    MyPageFolderReportDTO fldReprotDTO = gson.fromJson(gson.toJson(param), MyPageFolderReportDTO.class);

    boolean result = myPageFolderReportService.updateMyReport(fldReprotDTO);
    
    if (!result) return RestAPIVO.conflictResponse(false);
  
    return RestAPIVO.okResponse(result);
  }

  @PostMapping
  public boolean createMyPageFolder(
    @RequestParam(required = false, defaultValue = "") String name,
    @RequestParam(required = false, defaultValue = "") String desc,
    @RequestParam(required = false, defaultValue = "") int ordinal,
    @RequestParam(required = false, defaultValue = "") int fldLvl,
    @RequestParam(required = false, defaultValue = "") int fldParentId,
    HttpServletRequest request
  ) {
      UserDTO userDTO = SessionUtility.getSessionUser(request);

      int userNo = userDTO.getUserNo();
      MyPageFolderReportDTO fldReprotDTO = MyPageFolderReportDTO.builder()
        .name(name)
        .userNo(userNo)
        .desc(desc)
        .ordinal(ordinal)
        .fldLvl(fldLvl)
        .fldParentId(fldParentId)
        .build();
      
      return myPageFolderReportService.createMyFolder(fldReprotDTO);
  }

  @PostMapping("/delete")
  public ResponseEntity<RestAPIVO> deleteMyFolderData(
    // @RequestBody int[] data
    @RequestBody List<Integer> data
  ) throws Exception {
    boolean result = myPageFolderReportService.deleteMyFolder(data);

    if (!result) return RestAPIVO.conflictResponse(false, "The data doesn't update");
  
    return RestAPIVO.okResponse(result);
  }

  @PatchMapping("/edit-name")
  public boolean updateMyFolder(
    @RequestParam(required = true) int id,
    @RequestParam(required = false, defaultValue = "") int fldParentId,
    @RequestParam(required = false, defaultValue = "") int ordinal,
    @RequestParam(required = false, defaultValue = "") int fldLvl,
    @RequestParam(required = false, defaultValue = "") String name,
    @RequestParam(required = false, defaultValue = "") String fldDesc
  ) {
    MyPageFolderReportDTO fldReprotDTO = MyPageFolderReportDTO.builder()
        .id(id)    
        .fldParentId(fldParentId)
        .ordinal(ordinal)
        .fldLvl(fldLvl)
        .name(name)
        .desc(fldDesc)
        .build();
    
    return myPageFolderReportService.updateMyFolder(fldReprotDTO);
  }

  @PatchMapping("/move-folder")
  public ResponseEntity<RestAPIVO> updateMyFolder(@RequestBody List<MyPageFolderReportDTO> fldDtoList) {
    try {
      // 업데이트 시도
      boolean success = myPageFolderReportService.updateMyFolderList(fldDtoList);

      // 성공 시 200, 실패 시 400
      return success ? RestAPIVO.okResponse(true) : RestAPIVO.badRequest(false);
    } catch (Exception e) {
      // 예외 발생 시 500
      return RestAPIVO.conflictResponse(false);
    }
  }

  @PatchMapping("/move-report")
  public ResponseEntity<RestAPIVO> updateMyReport(@RequestBody List<MyPageFolderReportDTO> reportDtoList) {
    try {

      for (MyPageFolderReportDTO dto : reportDtoList) {
        dto.setName("");
        dto.setType("");
        dto.setSubtitle("");
        dto.setTag("");
        dto.setDesc("");
        dto.setPrompt("");
        dto.setMaxReportPeriodYn("");
      }
      // 업데이트 시도
      boolean success = myPageFolderReportService.updateMyReportList(reportDtoList);

      // 성공 시 200, 실패 시 400
      return success ? RestAPIVO.okResponse(true) : RestAPIVO.badRequest(false);
    } catch (Exception e) {
      // 예외 발생 시 500
      return RestAPIVO.conflictResponse(false);
    }
  }
}
