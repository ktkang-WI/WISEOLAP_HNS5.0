package com.wise.MarketingPlatForm.auth.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.account.dto.AuthReportDTO;
import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.auth.entity.AuthDataEntity;
import com.wise.MarketingPlatForm.auth.entity.UserEntity;

@Mapper
public interface AuthDAO {
    public UserEntity selectUserById(String userId);

    public List<String> selectMdCode(String userId);

    public GroupMstrEntity selectGroupMstrById(int grpId);

    public AuthDataEntity selectGrpAuthData(int grpId);

    public AuthDataEntity selectUserAuthData(int userNo);

    public AuthReportDTO selectGrpAuthReport(int fldId, int grpId);

    public AuthReportDTO selectUserAuthReport(int fldId, int userNo);

    public AuthDataEntity selectGrpAuthMeasure(int grpId);

    public AuthDataEntity selectUserAuthMeasure(int userNo);
}