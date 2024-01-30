package com.wise.MarketingPlatForm.sr.sysCode.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.sr.sysCode.dao.SysCodeDAO;
import com.wise.MarketingPlatForm.sr.sysCode.dto.SysCodeDTO;
import com.wise.MarketingPlatForm.sr.sysCode.service.SysCodeService;

@Service
public class SysCodeServiceImpl implements SysCodeService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    SysCodeDAO sysCodeDAO;

    @Autowired
    public SysCodeServiceImpl(SysCodeDAO sysCodeDAO) {
        this.sysCodeDAO = sysCodeDAO;
    }

    @Override
    public List<SysCodeDTO> selectSysCodeList(SysCodeDTO sysCodeDTO) {
        return null;
    }

    @Override
    public SysCodeDTO selectSysCodeByOne(int sysCd) {
        return null;
    }

    @Override
    public void insertSysCode(SysCodeDTO sysCodeDTO) {

    }

    @Override
    public void updateSysCode(SysCodeDTO sysCodeDTO) {

    }

    @Override
    public void deleteSysCode(List<Integer> sysCdList) {

    }

}
