package com.wise.MarketingPlatForm.account.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserMstrEntity {
  int userNo;
  String userId;
  String userNm;
  String passwd;
  String eMail1;
  String eMail2;
  String telNo;
  int grpId;
  String grpNm;
  String userRunMode;
  String grpRunMode;
  String userDesc;
}
