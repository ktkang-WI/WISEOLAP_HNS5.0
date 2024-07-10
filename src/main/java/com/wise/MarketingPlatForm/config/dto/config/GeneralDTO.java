package com.wise.MarketingPlatForm.config.dto.config;

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
  private String mainTitle;
  private String licensesKey;
  private String loginImage;
  private String logo;
  private String spreadJsLicense;
  private String spreadJsDesignLicense;
  private String kakaoMapApiKey;
  private String wiDefaultPage;
  private String adHocLayout;
}
