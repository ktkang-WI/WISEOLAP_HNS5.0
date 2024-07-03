package com.wise.MarketingPlatForm.auth.vo;

import com.wise.MarketingPlatForm.auth.type.RunMode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
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
    RunMode runMode;
    int lockCnt;
    String hasYn;
}
