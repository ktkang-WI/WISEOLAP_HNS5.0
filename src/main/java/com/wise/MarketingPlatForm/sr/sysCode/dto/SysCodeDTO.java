package com.wise.MarketingPlatForm.sr.sysCode.dto;

import java.util.Date;

import org.apache.ibatis.type.Alias;
import org.springframework.format.annotation.DateTimeFormat;

import com.wise.MarketingPlatForm.sr.sysCode.entity.SysCodeEntity;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;
import lombok.Builder;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Alias("SysCodeDTO")
public class SysCodeDTO {
    
    private int sysCd;

    private String cdNm;

    private int grpCd;

    private int upperGrpCd;

    private String useYn;

    @DateTimeFormat(pattern = "yyyyMMdd")
    private Date stYmd;

    @DateTimeFormat(pattern = "yyyyMMdd")
    private Date edYmd;

    private String crtBy;

    @DateTimeFormat(pattern = "yyyyMMdd")
    private Date crtDt;

    private String udtBy;

    @DateTimeFormat(pattern = "yyyyMMdd")
    private Date udtDt;
    
    private int sortBy;

    public SysCodeEntity toDo(SysCodeDTO sysCodeDTO) {
        return SysCodeEntity.builder()
                .sys_cd(sysCodeDTO.getSysCd())
                .cd_nm(sysCodeDTO.getCdNm())
                .grp_cd(sysCodeDTO.getGrpCd())
                .upper_grp_cd(sysCodeDTO.getUpperGrpCd())
                .use_yn(sysCodeDTO.getUseYn())
                .st_ymd(sysCodeDTO.getStYmd())
                .ed_ymd(sysCodeDTO.getEdYmd())
                .crt_by(sysCodeDTO.getCrtBy())
                .crt_dt(sysCodeDTO.getCrtDt())
                .udt_by(sysCodeDTO.getUdtBy())
                .udt_dt(sysCodeDTO.getUdtDt())
                .sort_by(sysCodeDTO.getSortBy())
                .build();
    }
}