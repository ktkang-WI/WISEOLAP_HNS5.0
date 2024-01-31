package com.wise.MarketingPlatForm.sr.sysCode.service;

import java.util.List;


import com.wise.MarketingPlatForm.sr.sysCode.dto.SysCodeDTO;

public interface SysCodeService {
    
    public List<SysCodeDTO> selectSysCodeList(SysCodeDTO sysCodeDTO);

    public SysCodeDTO selectSysCodeByOne(SysCodeDTO sysCodeDTO);

    public void insertSysCodeInfo(SysCodeDTO sysCodeDTO);

    public void updateSysCodeInfo(SysCodeDTO sysCodeDTO);

    public void updateSysCodeUseYN(List<SysCodeDTO> sysCdList);

}
