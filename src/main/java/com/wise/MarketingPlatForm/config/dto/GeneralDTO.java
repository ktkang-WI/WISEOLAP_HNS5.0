package com.wise.MarketingPlatForm.config.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GeneralDTO {
  String mainTitle;
  String licensesKey;
  String webUrl;
  String loginImage;
  String logo;
  String spreadJsLicense;
  String spreadJsDesignLicense;
  String kakaoMapApiKey;
  String menuConfig;
}
