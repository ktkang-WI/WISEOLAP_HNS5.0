package com.wise.MarketingPlatForm.dataset.vo;

import com.wise.MarketingPlatForm.dataset.entity.DsViewMstrEntity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class DsViewMstrDTO {
  int dsViewId;
  int dsId;
  String dsViewNm;
  String dsViewDesc;

  public static DsViewMstrEntity toEntity(DsViewMstrDTO dsViewMstrDTO) {
    return DsViewMstrEntity.builder()
      .dsViewId(dsViewMstrDTO.getDsViewId())
      .dsId(dsViewMstrDTO.getDsId())
      .dsViewNm(dsViewMstrDTO.getDsViewNm())
      .dsViewDesc(dsViewMstrDTO.getDsViewDesc())
      .build();
  }
}
