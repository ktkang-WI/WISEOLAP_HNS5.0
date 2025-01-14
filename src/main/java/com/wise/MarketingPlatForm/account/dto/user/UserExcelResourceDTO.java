package com.wise.MarketingPlatForm.account.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserExcelResourceDTO {
  String loginAcId;
  String userGid;
  String userNm;
  String userGlnm;
}
