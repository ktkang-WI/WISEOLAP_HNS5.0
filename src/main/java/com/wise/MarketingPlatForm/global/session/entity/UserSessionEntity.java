package com.wise.MarketingPlatForm.global.session.entity;
import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSessionEntity {
    String userId;
    int userNo;
    String userSessionKey;
    String accessIp;
    String logType;
    Timestamp lastMsgDt;
    int modUserNo;
    Timestamp modDt;
}
