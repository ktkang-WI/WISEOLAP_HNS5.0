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
public class CubeDimMstrEntity {
  int cubeId;
  int dsViewId;
  String dimUniNm;
  String dimCaption;
  String dimIsVisible;
  String dimDimUniNm;
  int dimOrdinal;
}
