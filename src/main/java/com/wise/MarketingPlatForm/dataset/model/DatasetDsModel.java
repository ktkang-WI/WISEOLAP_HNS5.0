package com.wise.MarketingPlatForm.dataset.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class DatasetDsModel {
  int dsId;
  String dsNm;
  String dbmsType;
  String ownerNm;
  String ip;
}
