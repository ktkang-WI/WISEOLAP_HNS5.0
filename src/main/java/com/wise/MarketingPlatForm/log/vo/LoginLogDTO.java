package com.wise.MarketingPlatForm.log.vo;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginLogDTO {
    String eventDt;
    String eventTime;
    Timestamp eventStamp;
    String logType;
    String userId;
    String userNm;
    int userNo;
    int groupId;
    String groupNm;
    String accessIp;
    String accessGuid;
    Timestamp modStamp;
    int modUserNo;
    String modDt;
}
