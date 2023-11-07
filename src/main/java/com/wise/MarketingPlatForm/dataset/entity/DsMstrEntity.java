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
public class DsMstrEntity {
  int dsId;
  String dsNm;
  String dbNm;
  String ip;
  String userId;
  String password;
  String port;
  String dbmsType;
  String ownerNm;
  String dsDesc;
  String connector;
  String connectorType;
  String userAreaYn;
  String hashYn;
  String wfYn;
}
