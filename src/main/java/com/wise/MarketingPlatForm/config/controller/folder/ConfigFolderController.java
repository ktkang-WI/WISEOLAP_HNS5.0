package com.wise.MarketingPlatForm.config.controller.folder;

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
import com.wise.MarketingPlatForm.config.entity.FldMstrEntity;
import com.wise.MarketingPlatForm.config.service.folder.ConfigFolderService;

import org.springframework.web.bind.annotation.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "config-folder", description = "폴더 리스트를 가져옵니다.")
@RestController
@RequestMapping("/config/folder")
public class ConfigFolderController {
  
  @Autowired
  private ConfigFolderService configFolderService;


  @GetMapping
  public ResponseEntity<RestAPIVO> getConfigFolderData() throws Exception {

    List<FldMstrEntity> model = configFolderService.getConfigFolderData();

    if (model == null) return RestAPIVO.conflictResponse(null);

    return RestAPIVO.okResponse(model);
  
  }
  @PostMapping
  public ResponseEntity<RestAPIVO> createConfigFolderData(
    @RequestParam(required = true) String fldNm,
    @RequestParam(required = false, defaultValue = "0") int fldLvl,
    @RequestParam(required = false, defaultValue = "0") int fldParentId,
    @RequestParam(required = false, defaultValue = "") int fldOrdinal,
    @RequestParam(required = false, defaultValue = "0") String fldDesc
  ) throws Exception {

    FldMstrEntity fldMstr = FldMstrEntity.builder()
      .fldNm(fldNm)
      .fldLvl(fldLvl)
      .fldParentId(fldParentId)
      .fldOrdinal(fldOrdinal)
      .fldDesc(fldDesc)
      .build();

    boolean result = configFolderService.createConfigFolder(fldMstr);

    if (!result) return RestAPIVO.conflictResponse(false);
  
    return RestAPIVO.okResponse(result);
  }

  @PatchMapping
  public ResponseEntity<RestAPIVO> patchConfigFolderData(
    @RequestParam(required = true) int fldId,
    @RequestParam(required = false, defaultValue = "") String fldNm,
    @RequestParam(required = false, defaultValue = "0") int fldLvl,
    @RequestParam(required = false, defaultValue = "0") int fldParentId,
    @RequestParam(required = false, defaultValue = "0") int fldOrdinal,
    @RequestParam(required = false, defaultValue = "") String fldDesc
  ) throws Exception {

    FldMstrEntity fldMstr = FldMstrEntity.builder()
      .fldId(fldId)
      .fldNm(fldNm)
      .fldLvl(fldLvl)
      .fldParentId(fldParentId)
      .fldOrdinal(fldOrdinal)
      .fldDesc(fldDesc)
      .build();

    boolean result = configFolderService.patchConfigFolder(fldMstr);

    if (!result) return RestAPIVO.conflictResponse(false);
  
    return RestAPIVO.okResponse(result);
  }

  @PatchMapping("/reorderFolders")
  public ResponseEntity<RestAPIVO> reorderFolders(@RequestBody List<FldMstrEntity> folders){
    boolean result = configFolderService.reorderFolders(folders);

    if (!result) return RestAPIVO.conflictResponse(false);
  
    return RestAPIVO.okResponse(result);
  }

  @DeleteMapping
  public ResponseEntity<RestAPIVO> deleteConfigFolderData(
    @RequestParam(required = true) int fldId
  ) throws Exception {

    FldMstrEntity fldMstr = FldMstrEntity.builder()
      .fldId(fldId)
      .build();

    boolean result = configFolderService.deleteConfigFolder(fldMstr);

    if (!result) return RestAPIVO.conflictResponse(false);

    return RestAPIVO.okResponse(result);
  }

}
