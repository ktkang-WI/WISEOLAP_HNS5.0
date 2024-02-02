package com.wise.MarketingPlatForm.account.model.common;

import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class DataSetXmlModel {
  List<Integer> dsViewId;
  Map<Integer,List<Integer>> cubeId;
  Map<Integer,List<String>> cubeDimNm;
}
