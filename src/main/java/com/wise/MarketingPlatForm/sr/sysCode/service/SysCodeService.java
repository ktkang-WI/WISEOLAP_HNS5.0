package com.wise.MarketingPlatForm.sr.sysCode.service;

import java.util.List;


import com.wise.MarketingPlatForm.sr.sysCode.dto.SysCodeDTO;

public interface SysCodeService {
    
    public List<SysCodeDTO> selectSysCodeList(SysCodeDTO sysCodeDTO);

    public SysCodeDTO selectSysCodeByOne(int sysCd);

    public void insertSysCode(SysCodeDTO sysCodeDTO);

    public void updateSysCode(SysCodeDTO sysCodeDTO);

    public void deleteSysCode(List<Integer> sysCdList);

}
