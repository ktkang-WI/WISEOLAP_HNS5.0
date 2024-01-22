package com.wise.MarketingPlatForm.dataset.model;

import java.util.List;

import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeMstrEntity;
import com.wise.MarketingPlatForm.dataset.dto.ds.DatasetDsDsviewCubeDTO;
import com.wise.MarketingPlatForm.dataset.entity.CubeDimMstrEntity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class DatasetDsDsviewCubeModel {
  DatasetDsDsviewCubeDTO dsView;
  List<CubeMstrEntity> cube;
  List<CubeDimMstrEntity> cubeDim;
}
