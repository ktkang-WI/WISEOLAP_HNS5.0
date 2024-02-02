package com.wise.MarketingPlatForm.account.model.user;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDetailInfoModel {
  String userId;
  String userNm;
  String eMail1;
  String eMail2;
  String telNo;
  String grpNm;
  String userRunMode;
  String grpRunMode;
  String userDesc;
}
