package com.wise.MarketingPlatForm.account.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDataDTO {
  int userNo;
  String userId;
  String userNm;
  String dataXml;
}
