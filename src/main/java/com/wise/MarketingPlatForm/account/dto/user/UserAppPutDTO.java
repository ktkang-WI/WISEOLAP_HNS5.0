package com.wise.MarketingPlatForm.account.dto.user;

import com.wise.MarketingPlatForm.account.model.common.ProgModel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAppPutDTO {
  int userNo;
  ProgModel prog;
}
