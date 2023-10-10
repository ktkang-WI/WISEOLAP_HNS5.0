package com.wise.MarketingPlatForm.auth.dao;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.auth.entity.AuthDataEntity;
import com.wise.MarketingPlatForm.auth.entity.UserEntity;

@Mapper
public interface AuthDAO {
  public UserEntity selectUserById(String userId);

  public AuthDataEntity selectGrpAuthData(int grpId);

  public AuthDataEntity selectUserAuthData(int userNo);
}