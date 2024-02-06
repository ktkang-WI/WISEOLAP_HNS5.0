package com.wise.MarketingPlatForm.account.dto.group;

import java.util.List;

import com.wise.MarketingPlatForm.dataset.dto.ds.DataDsviewCubeDimDTO;
import com.wise.MarketingPlatForm.dataset.dto.ds.DatasetDsDsviewCubeDTO;
import com.wise.MarketingPlatForm.dataset.entity.CubeMstrEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupDataPutDTO {
  int grpId;
  List<DatasetDsDsviewCubeDTO> dsView;
  List<CubeMstrEntity> cube;
  List<DataDsviewCubeDimDTO> cubeDim;
}
