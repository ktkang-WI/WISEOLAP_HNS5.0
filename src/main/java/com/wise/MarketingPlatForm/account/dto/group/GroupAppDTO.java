package com.wise.MarketingPlatForm.account.dto.group;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupAppDTO {
  int grpId;
  String grpNm;
  String grpDesc;
  String authData;
}
