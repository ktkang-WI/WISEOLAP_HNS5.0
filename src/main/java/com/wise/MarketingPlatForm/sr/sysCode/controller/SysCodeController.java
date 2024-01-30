package com.wise.MarketingPlatForm.sr.sysCode.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.sr.sysCode.dto.SysCodeDTO;
import com.wise.MarketingPlatForm.sr.sysCode.service.SysCodeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "system code", description = "system code 요청 처리")
@RestController
@RequestMapping("/sr")
public class SysCodeController {
    
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    SysCodeService sysCodeService;

    @Autowired
    public SysCodeController(SysCodeService sysCodeService) {
        this.sysCodeService = sysCodeService;
    }

    @Operation(summary = "system code 조회", description = "CSR_SYS_CD_INFO 테이블 데이터 조회")
    @GetMapping(value = "/sys-code")
    public List<SysCodeDTO> selectSysCodeList(SysCodeDTO sysCodeDTO) {
        return null;
    } 

    @Operation(summary = "system code 부분 조회", description = "CSR_SYS_CD_INFO 테이블 데이터 부분 조회")
    @GetMapping(value = "/sys-code/{sysCodeId}")
    public SysCodeDTO selectSysCodeByOne(@PathVariable int sysCd) {
        return null;
    }

    @Operation(summary = "system code 입력", description = "CSR_SYS_CD_INFO 테이블 데이터 입력")
    @PostMapping(value = "/sys-code")
    public void insertSysCode(SysCodeDTO sysCodeDTO) {

    }

    @Operation(summary = "system code 수정", description = "CSR_SYS_CD_INFO 테이블 데이터 수정")
    @PutMapping(value = "/sys-code")
    public void updateSysCode(SysCodeDTO sysCodeDTO) {

    }

    @Operation(summary = "system code 삭제", description = "CSR_SYS_CD_INFO 테이블 데이터 삭제 (실제로는 사용여부 컬럼인 use_yn 의 값을 N로 변경)")
    @DeleteMapping(value = "/sys-code")
    public void deleteSysCode(@RequestParam List<Integer> sysCdList) {

    }


}
