package com.wise.MarketingPlatForm.sr.sysCode.entity;

import java.util.Date;

import org.apache.ibatis.type.Alias;
import org.springframework.format.annotation.DateTimeFormat;

import com.wise.MarketingPlatForm.sr.sysCode.dto.SysCodeDTO;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Alias("SysCodeEntity")
public class SysCodeEntity {
    
    private int sys_cd;

    private String cd_nm;

    private int grp_cd;

    private int upper_grp_cd;

    private String use_yn;

    @DateTimeFormat(pattern = "yyyyMMdd")
    private Date st_ymd;

    @DateTimeFormat(pattern = "yyyyMMdd")
    private Date ed_ymd;

    private String crt_by;

    @DateTimeFormat(pattern = "yyyyMMdd")
    private Date crt_dt;

    private String udt_by;

    @DateTimeFormat(pattern = "yyyyMMdd")
    private Date udt_dt;
    
    private int sort_by;

    public SysCodeDTO toDo(SysCodeEntity sysCodeEntity) {
        return SysCodeDTO.builder()
                .sysCd(sysCodeEntity.getSys_cd())
                .cdNm(sysCodeEntity.getCd_nm())
                .grpCd(sysCodeEntity.getGrp_cd())
                .upperGrpCd(sysCodeEntity.getUpper_grp_cd())
                .useYn(sysCodeEntity.getUse_yn())
                .stYmd(sysCodeEntity.getSt_ymd())
                .edYmd(sysCodeEntity.getEd_ymd())
                .crtBy(sysCodeEntity.getCrt_by())
                .crtDt(sysCodeEntity.getCrt_dt())
                .udtBy(sysCodeEntity.getUdt_by())
                .udtDt(sysCodeEntity.getUdt_dt())
                .sortBy(sysCodeEntity.getSort_by())
                .build();
    }
}
