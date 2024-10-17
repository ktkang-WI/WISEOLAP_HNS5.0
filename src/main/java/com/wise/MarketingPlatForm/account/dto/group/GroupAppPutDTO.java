package com.wise.MarketingPlatForm.account.dto.group;

import com.wise.MarketingPlatForm.account.model.common.ProgModel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupAppPutDTO {
  int grpId;
  ProgModel prog;
}
