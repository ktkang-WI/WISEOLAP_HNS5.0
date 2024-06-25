package com.wise.MarketingPlatForm.account.model.groups.data;

import java.util.List;

import com.wise.MarketingPlatForm.account.dto.CubeDTO;
import com.wise.MarketingPlatForm.account.dto.DsViewDimDTO;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DataModel {
  Integer dsViewId;
  List<CubeDTO> cubeId;
  List<DsViewDimDTO> dsViewDim;
}
