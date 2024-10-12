package com.wise.MarketingPlatForm.auth.vo;

import com.wise.MarketingPlatForm.auth.type.RunMode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO implements Serializable{
    private static final long serialVersionUID = 1L;

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
    String grpRunMode;
    int lockCnt;
    String hasYn;
    String mdCode;
    String pwChangeDt;
    @Builder.Default
    int isChangePw = 0;
}
