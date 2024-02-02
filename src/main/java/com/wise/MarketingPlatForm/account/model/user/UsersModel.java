package com.wise.MarketingPlatForm.account.model.user;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UsersModel {
  int userNo;
  String userId;
  String userNm;
  String grpNm;
  UserDetailInfoModel userDetailInfo;
}
