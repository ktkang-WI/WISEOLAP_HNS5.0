package com.wise.MarketingPlatForm.sr.sysCode.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.sr.sysCode.entity.SysCodeEntity;

@Mapper
public interface SysCodeDAO {

    public List<SysCodeEntity> selectSysCodeList(SysCodeEntity sysCodeEntity);

    public SysCodeEntity selectSysCodeByOne(SysCodeEntity sysCodeEntity);

    public void insertSysCodeInfo(SysCodeEntity sysCodeEntity);

    public void updateSysCodeInfo(SysCodeEntity sysCodeEntity);

    public void updateSysCodeUseYN(List<SysCodeEntity> sysCdList);

}
