package com.wise.MarketingPlatForm.global.session.dao;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.auth.entity.UserEntity;
import com.wise.MarketingPlatForm.global.session.entity.UserSessionEntity;

@Mapper
public interface SessionDAO {
    public void saveSessionUser(UserSessionEntity userSession);

    public UserEntity getSessionUser(String sessionId);

    public void deleteSessionUser(String sessionId);

    public void deleteSessionUserSchedule();

    public void updateSessionUser(UserSessionEntity userSession);

    public UserEntity getSessionUserAll(String sessionId);
} 
