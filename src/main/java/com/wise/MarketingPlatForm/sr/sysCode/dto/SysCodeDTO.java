package com.wise.MarketingPlatForm.sr.sysCode.dto;

import org.apache.ibatis.type.Alias;

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

    private SysCodeEntity sysCodeEntity;

    public SysCodeDTO(SysCodeDTO sysCodeDTO) {
        this.sysCodeEntity = toDo(sysCodeDTO);
    }
    
    private String seqCd;

    private String sysCd;

    private String subCd;

    private String jobCd;

    private String seqNm;

    private String sysNm;

    private String subNm;

    private String jobNm;

    private int grpCd;

    private int upperGrpCd;

    private String useYn;

    private String stYmd;

    private String edYmd;

    private String crtBy;

    private String crtDt;

    private String udtBy;

    private String udtDt;
    
    private int sortBy;

    public SysCodeEntity toDo(SysCodeDTO sysCodeDTO) {
        return SysCodeEntity.builder()
                .seq_cd(sysCodeDTO.getSeqCd())
                .sys_cd(sysCodeDTO.getSysCd())
                .sub_cd(sysCodeDTO.getSubCd())
                .job_cd(sysCodeDTO.getJobCd())
                .seq_nm(sysCodeDTO.getSeqNm())
                .sys_nm(sysCodeDTO.getSysNm())
                .sub_nm(sysCodeDTO.getSubNm())
                .job_nm(sysCodeDTO.getJobNm())
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