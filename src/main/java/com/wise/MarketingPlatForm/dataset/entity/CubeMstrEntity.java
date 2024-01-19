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
public class CubeMstrEntity {
  int cubeId;
  int dsViewId;
  String cubeNm;
  String cubeDesc;
  int cubeOridinal;
}
