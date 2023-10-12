package com.wise.MarketingPlatForm.dataset.domain.cube.vo;

import java.util.List;

import com.wise.MarketingPlatForm.dataset.vo.DatasetFieldVO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CubeInfoDTO {
  List<DatasetFieldVO> fields;
}
