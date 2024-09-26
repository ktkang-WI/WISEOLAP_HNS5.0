package com.wise.MarketingPlatForm.auth.entity;

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
public class UserEntity {
    int userNo;
    int grpId;
    String userId;
    String userNm;
    String password;
    String email;
    String email2;
    String delYn;
    String hpNo;
    String telNo;
    String userRelCd;
    String userDesc;
    String runMode;
    int lockCnt;
    String hashYn;
    String mdCode;
}
