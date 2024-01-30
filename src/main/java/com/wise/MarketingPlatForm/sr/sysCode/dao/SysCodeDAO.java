package com.wise.MarketingPlatForm.sr.sysCode.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.sr.sysCode.entity.SysCodeEntity;

@Mapper
public interface SysCodeDAO {

    public List<SysCodeEntity> selectSysCodeList(SysCodeEntity sysCodeEntity);

    public SysCodeEntity selectSysCodeByOne(int sysCd);

    public void insertSysCode(SysCodeEntity sysCodeEntity);

    public void updateSysCode(SysCodeEntity sysCodeEntity);

    public void deleteSysCode(List<Integer> sysCdList);

}
