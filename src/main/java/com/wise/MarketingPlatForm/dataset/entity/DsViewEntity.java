package com.wise.MarketingPlatForm.dataset.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DsViewEntity {
  int dsViewId;
  int dsId;
  String dsViewNm;
  String dsViewDesc;
  String dbNm;
  String ip;
  String dbType;
  String dbmsType;
  String dsNm;
  String userAreaYn;
  String port;
  String ownerNm;
  String userId;
}
