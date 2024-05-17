package com.wise.MarketingPlatForm.config.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
