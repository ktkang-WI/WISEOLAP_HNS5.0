package com.wise.MarketingPlatForm.sr.sysCode.entity;

import org.apache.ibatis.type.Alias;

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

    private SysCodeDTO sysCodeDTO;

    public SysCodeEntity(SysCodeEntity sysCodeEntity) {
        this.sysCodeDTO = toDo(sysCodeEntity);
    }
    
    private String seq_cd;

    private String sys_cd;

    private String sub_cd;

    private String job_cd;

    private String seq_nm;

    private String sys_nm;

    private String sub_nm;

    private String job_nm;

    private int grp_cd;

    private int upper_grp_cd;

    private String use_yn;

    private String st_ymd;

    private String ed_ymd;

    private String crt_by;

    private String crt_dt;

    private String udt_by;

    private String udt_dt;
    
    private int sort_by;

    public SysCodeDTO toDo(SysCodeEntity sysCodeEntity) {
        return SysCodeDTO.builder()
                .seqCd(sysCodeEntity.getSeq_cd())
                .sysCd(sysCodeEntity.getSys_cd())
                .subCd(sysCodeEntity.getSub_cd())
                .jobCd(sysCodeEntity.getJob_cd())
                .seqNm(sysCodeEntity.getSeq_nm())
                .sysNm(sysCodeEntity.getSys_nm())
                .subNm(sysCodeEntity.getSub_nm())
                .jobNm(sysCodeEntity.getJob_nm())
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
