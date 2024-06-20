package com.wise.MarketingPlatForm.log.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginLogDTO {
    String eventDt;
    String eventTime;
    String logType;
    String userId;
    int userNo;
    int groupId;
    String groupNm;
    String accessIp;
    String accessGuid;
    int modUserNo;
    String modDt;
}
