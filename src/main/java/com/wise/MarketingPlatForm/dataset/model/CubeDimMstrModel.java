package com.wise.MarketingPlatForm.dataset.model;

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
public class CubeDimMstrModel {
  int cubeId;
  int dsViewId;
  String cubeNm;
  String dimUniNm;
  String dimCaption;
  String dimIsVisible;
  String dimDimUniNm;
  int dimOrdinal;
}
