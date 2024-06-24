package com.wise.MarketingPlatForm.account.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CubeDimDTO {
  Integer dsViewId;
  Integer cubeId;
  String cubeNm;
  String dimDimUniNm;
}
