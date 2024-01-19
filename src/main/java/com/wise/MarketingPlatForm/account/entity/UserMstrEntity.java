package com.wise.MarketingPlatForm.account.entity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserMstrEntity {
  int userNo;
  int grpId;
  String userId;
  String userNm;
  String passwd;
  String eMail1;
  String eMail2;
  String delYn;
  String hpNo;
  String telNo;
  String userRelCd;
  String userDesc;
  String runMode;
  String pwChangeDt;
  String compCd;
  String lockCnt;
  String hashYn;
}
