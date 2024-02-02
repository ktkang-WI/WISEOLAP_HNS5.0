package com.wise.MarketingPlatForm.config.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class WbConfigMstrEntity {
  String loginImage;
  String logo;
  String spreadJsLicense;
  String spreadJsDesignLicense;
  String kakaoMapApiKey;
}
