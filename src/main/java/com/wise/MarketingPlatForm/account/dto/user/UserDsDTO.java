package com.wise.MarketingPlatForm.account.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDsDTO {
  int userNo;
  String userId;
  String userDesc;
  int dsId;
  String dsNm;
  String dbmsType;
  String ownerNm;
  String ip;
  String dbNm;
}
