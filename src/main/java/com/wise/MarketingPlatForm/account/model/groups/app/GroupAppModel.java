package com.wise.MarketingPlatForm.account.model.groups.app;

import com.wise.MarketingPlatForm.account.model.common.ProgModel;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupAppModel {
  Integer grpId;
  ProgModel prog;
}
