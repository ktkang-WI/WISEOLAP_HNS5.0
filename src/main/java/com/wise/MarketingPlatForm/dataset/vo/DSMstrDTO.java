package com.wise.MarketingPlatForm.dataset.vo;

import com.wise.MarketingPlatForm.dataset.type.DBMSType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Builder
public class DSMstrDTO {
  int dsId;
  String dsNm;
  String dbNm;
  String ip;
  String userId;
  String password;
  String port;
  DBMSType dbmsType;
  String ownerNm;
  String dsDesc;
  String connector;
  String userAreaYn;
}
