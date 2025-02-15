package com.wise.MarketingPlatForm.dataset.dto.ds;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class DatasetDsDTO {
  int dsId;
  int dsViewId;
  String dsViewNm;
  String dsNm;
  String dbmsType;
  String ownerNm;
  String ip;
  String dbNm;
}
