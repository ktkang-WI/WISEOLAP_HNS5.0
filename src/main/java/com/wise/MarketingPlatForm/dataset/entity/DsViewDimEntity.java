package com.wise.MarketingPlatForm.dataset.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DsViewDimEntity {
  int dsViewId;
  String dimCaption;
  String dimDimUniNm;
}
