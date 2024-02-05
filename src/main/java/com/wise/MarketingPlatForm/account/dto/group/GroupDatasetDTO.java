package com.wise.MarketingPlatForm.account.dto.group;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupDatasetDTO {
  int grpId;
  String grpNm;
  String grpDesc;
  int fldId;
  String fldNm;
  int parentFldId;
}
