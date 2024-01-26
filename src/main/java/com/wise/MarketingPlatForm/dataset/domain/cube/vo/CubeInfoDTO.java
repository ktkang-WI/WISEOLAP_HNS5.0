package com.wise.MarketingPlatForm.dataset.domain.cube.vo;

import java.util.List;

import com.wise.MarketingPlatForm.dataset.vo.RootFieldVO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CubeInfoDTO {
  List<RootFieldVO> fields;
  List<DetailedDataVO> detailedData;
}
