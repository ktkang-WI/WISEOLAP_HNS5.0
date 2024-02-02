package com.wise.MarketingPlatForm.account.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDatasetDTO {
  int userNo;
  String userId;
  String userNm;
  String grpNm;
  int fldId;
  String fldNm;
  int parentFldId;
}
