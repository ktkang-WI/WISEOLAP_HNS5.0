package com.wise.MarketingPlatForm.account.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMstrEntity {
  int userNo;
  int grpId;
  String grpNm;
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
