package com.wise.MarketingPlatForm.account.model.groups.data;

import java.util.List;

import com.wise.MarketingPlatForm.account.dto.CubeDTO;
import com.wise.MarketingPlatForm.account.dto.CubeDimDTO;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DataModel {
  Integer dsViewId;
  List<CubeDTO> cubeId;
  List<CubeDimDTO> cubeDim;
}
