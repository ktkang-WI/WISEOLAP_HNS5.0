package com.wise.MarketingPlatForm.account.model.user;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDetailInfoModel {
  int userNo;
  String userId;
  String userNm;
  String eMail1;
  String eMail2;
  String telNo;
  int grpId;
  String grpNm;
  String userRunMode;
  String grpRunMode;
  String userDesc;
}
