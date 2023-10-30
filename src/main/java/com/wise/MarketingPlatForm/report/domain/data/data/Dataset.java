package com.wise.MarketingPlatForm.report.domain.data.data;

import com.wise.MarketingPlatForm.dataset.type.DsType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Dataset {
  // 주제영역일 경우 해당 컬럼 cubeId로 사용
  int dsId;
  String query;
  DsType dsType;
}
