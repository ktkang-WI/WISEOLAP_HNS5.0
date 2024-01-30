package com.wise.MarketingPlatForm.sr.sysCode.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.sr.sysCode.dao.SysCodeDAO;
import com.wise.MarketingPlatForm.sr.sysCode.dto.SysCodeDTO;
import com.wise.MarketingPlatForm.sr.sysCode.entity.SysCodeEntity;
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
        SysCodeEntity sysCodeEntity = new SysCodeDTO(sysCodeDTO).getSysCodeEntity();
        List<SysCodeEntity> entityList = sysCodeDAO.selectSysCodeList(sysCodeEntity);
        List<SysCodeDTO> dtoList = new ArrayList<SysCodeDTO>();
        for(SysCodeEntity entity : entityList) {
            dtoList.add(new SysCodeEntity(entity).getSysCodeDTO());
        }
        return dtoList;
    }

    @Override
    public SysCodeDTO selectSysCodeByOne(SysCodeDTO sysCodeDTO) {
        SysCodeEntity sysCodeEntity = new SysCodeDTO(sysCodeDTO).getSysCodeEntity();
        SysCodeEntity resultEntity = sysCodeDAO.selectSysCodeByOne(sysCodeEntity);
        SysCodeDTO resultDTO = new SysCodeEntity(resultEntity).getSysCodeDTO();
        return resultDTO;
    }

    @Override
    public void insertSysCodeInfo(SysCodeDTO sysCodeDTO) {
        SysCodeEntity sysCodeEntity = new SysCodeDTO(sysCodeDTO).getSysCodeEntity();
        sysCodeDAO.insertSysCodeInfo(sysCodeEntity);
    }

    @Override
    public void updateSysCodeInfo(SysCodeDTO sysCodeDTO) {
        SysCodeEntity sysCodeEntity = new SysCodeDTO(sysCodeDTO).getSysCodeEntity();
        sysCodeDAO.updateSysCodeInfo(sysCodeEntity);
    }

    @Override
    public void updateSysCodeUseYN(List<SysCodeDTO> sysCdList) {
        List<SysCodeEntity> dtoList = new ArrayList<SysCodeEntity>();
        for(SysCodeDTO sysCode : sysCdList) {
            dtoList.add(new SysCodeDTO(sysCode).getSysCodeEntity());
        }
        sysCodeDAO.updateSysCodeUseYN(dtoList);
    }

}
