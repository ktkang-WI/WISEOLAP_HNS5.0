package com.wise.MarketingPlatForm.dataset.vo;

import com.wise.MarketingPlatForm.dataset.entity.DsViewMstrEntity;
import com.wise.MarketingPlatForm.dataset.entity.DsViewTableEntity;

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
public class DsViewTableDTO {
  int dsViewId;
  String tableNm;
  String tableCaption;
  String tableDesc;
  String tableType;
  String tableGrpNm;
  String queryDefinition;

  public static DsViewTableEntity toEntity(DsViewTableDTO dsViewTableDTO) {
    return DsViewTableEntity.builder()
      .dsViewId(dsViewTableDTO.getDsViewId())
      .tableNm(dsViewTableDTO.getTableNm())
      .tableCaption(dsViewTableDTO.getTableCaption())
      .tableDesc(dsViewTableDTO.getTableDesc())
      .tableType(dsViewTableDTO.getTableType())
      .tableGrpNm(dsViewTableDTO.getTableGrpNm())
      .queryDefinition(dsViewTableDTO.getQueryDefinition())
      .build();
  }
}
