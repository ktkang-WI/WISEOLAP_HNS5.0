package com.wise.MarketingPlatForm.account.model.UsersModel;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UsersFormatModel {
  int userNo;
  String userId;
  String userNm;
  String grpNm;
  UserDetailInfoModel userDetailInfo;
}
