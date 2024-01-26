package com.wise.MarketingPlatForm.report.domain.data.data;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class AdHocOption {
  TopBottomInfo topBottomInfo;
  String layoutSetting;

  public AdHocOption(TopBottomInfo topBottomInfo, String layoutSetting) {
    this.topBottomInfo = topBottomInfo;
    this.layoutSetting = layoutSetting;
  }
}
