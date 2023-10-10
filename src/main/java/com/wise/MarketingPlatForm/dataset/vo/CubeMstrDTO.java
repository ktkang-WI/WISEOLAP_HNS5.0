package com.wise.MarketingPlatForm.dataset.vo;

import com.wise.MarketingPlatForm.dataset.entity.CubeMstrEntity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CubeMstrDTO {
  int cubeId;
  int dsViewId;
  String cubeNm;
  String cubeDesc;
  int ordinal;

  public static CubeMstrEntity toEntity(CubeMstrDTO cubeMstrDTO) {
    return CubeMstrEntity.builder()
      .cubeId(cubeMstrDTO.getCubeId())
      .dsViewId(cubeMstrDTO.getDsViewId())
      .cubeNm(cubeMstrDTO.getCubeNm())
      .cubeDesc(cubeMstrDTO.getCubeDesc())
      .ordinal(cubeMstrDTO.getOrdinal())
      .build();
  }
}
