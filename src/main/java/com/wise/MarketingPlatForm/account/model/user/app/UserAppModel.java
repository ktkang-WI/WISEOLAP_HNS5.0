package com.wise.MarketingPlatForm.account.model.user.app;

import com.wise.MarketingPlatForm.account.model.common.ProgModel;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserAppModel {
  Integer userNo;
  ProgModel prog;
}
