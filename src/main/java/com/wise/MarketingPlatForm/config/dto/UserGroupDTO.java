package com.wise.MarketingPlatForm.config.dto;

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
  String eMail1;
  String eMail2;
  String telNo;
  String userRunMode;
  String userDesc;
  int grpId;
  String grpNm;
  String grpRunMode;
  String grpDesc;
}
