package com.wise.MarketingPlatForm.config.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class GeneralDTO {
  String mainTitle;
  String licensesKey;
  String webUrl;
  String loginImage;
  String logo;
  String spreadJsLicense;
  String spreadJsDesignLicense;
  String kakaoMapApiKey;
}
