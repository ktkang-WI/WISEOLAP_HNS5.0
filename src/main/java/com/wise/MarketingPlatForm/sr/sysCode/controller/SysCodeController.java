package com.wise.MarketingPlatForm.sr.sysCode.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
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

@Tag(name = "system-code", description = "system code 요청 처리")
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
        return sysCodeService.selectSysCodeList(sysCodeDTO);
    } 

    @Operation(summary = "system code 부분 조회", description = "CSR_SYS_CD_INFO 테이블 데이터 부분 조회")
    @GetMapping(value = "/sys-code/{seqCd}")
    public SysCodeDTO selectSysCodeByOne(@PathVariable String seqCd) {
        SysCodeDTO sysCodeDTO = new SysCodeDTO();
        sysCodeDTO.setSeqCd(seqCd);
        return sysCodeService.selectSysCodeByOne(sysCodeDTO);
    }

    @Operation(summary = "system code 입력", description = "CSR_SYS_CD_INFO 테이블 데이터 입력")
    @PostMapping(value = "/sys-code")
    public void insertSysCodeInfo(SysCodeDTO sysCodeDTO) {
        sysCodeDTO.setCrtDt(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + " " + LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
        sysCodeService.insertSysCodeInfo(sysCodeDTO);
    }

    @Operation(summary = "system code 정보 수정", description = "CSR_SYS_CD_INFO 테이블 데이터 수정")
    @PutMapping(value = "/sys-code")
    public void updateSysCodeInfo(SysCodeDTO sysCodeDTO) {
        sysCodeDTO.setUdtDt(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + " " + LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
        sysCodeService.updateSysCodeInfo(sysCodeDTO);
    }

    @Operation(summary = "system code 삭제 (사용여부 수정)", description = "CSR_SYS_CD_INFO 코드 사용 여부 수정 : Y -> N)")
    @DeleteMapping(value = "/sys-code")
    public void updateSysCodeUseYN(@RequestParam List<SysCodeDTO> sysCdList) {
        sysCodeService.updateSysCodeUseYN(sysCdList);
    }


}
