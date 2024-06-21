package com.wise.MarketingPlatForm.account.dto.group;

import java.util.List;

import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeMstrEntity;
import com.wise.MarketingPlatForm.dataset.dto.ds.DataDsviewCubeDimDTO;
import com.wise.MarketingPlatForm.dataset.dto.ds.DatasetDsDsviewCubeDTO;

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
  List<DatasetDsDsviewCubeDTO> dsView; // List<Integer>
  List<CubeMstrEntity> cube; // List<CubeModel> CubeModel - Integer dsViewId , List<Integer> cubeId
  List<DataDsviewCubeDimDTO> cubeDim; // list<CubeDimModel> cubeDimModel - Integer dsViewId , List<String> dimUniNm
}
