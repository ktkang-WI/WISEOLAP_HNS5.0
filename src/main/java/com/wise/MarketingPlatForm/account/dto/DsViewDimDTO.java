package com.wise.MarketingPlatForm.account.dto;

import lombok.Builder;
import lombok.Getter;


// TODO: 파일 경로 재구성 필요
@Getter
@Builder
public class DsViewDimDTO {
  Integer dsViewId;
  String dimDimUniNm;
  String hieUniNm;
}
