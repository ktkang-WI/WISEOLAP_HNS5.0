package com.wise.MarketingPlatForm.account.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserGroupDTO {
  int userNo;
  String userId;
  String userNm;
  @Builder.Default
  String compCode = "";
  @Builder.Default
  String accountCreateDt = "";
  String passwd;
  String eMail1;
  String eMail2;
  String telNo;
  String hpNo;
  String userRunMode;
  String userDesc;
  int grpId;
  String grpNm;
  String grpRunMode;
  String grpDesc;
}
