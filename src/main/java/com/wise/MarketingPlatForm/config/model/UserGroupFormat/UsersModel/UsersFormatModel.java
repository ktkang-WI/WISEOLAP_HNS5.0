package com.wise.MarketingPlatForm.config.model.UserGroupFormat.UsersModel;

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
