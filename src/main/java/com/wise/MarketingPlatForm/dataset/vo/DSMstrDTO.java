package com.wise.MarketingPlatForm.dataset.vo;

import com.wise.MarketingPlatForm.dataset.entity.DSMstrEntity;
import com.wise.MarketingPlatForm.dataset.type.DBMSType;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
@Setter
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
  String hashYn;

  public static DSMstrEntity toEntity(DSMstrDTO dsMstrDTO) {
    return DSMstrEntity.builder()
      .dsId(dsMstrDTO.getDsId())
      .dbNm(dsMstrDTO.getDbNm())
      .ip(dsMstrDTO.getIp())
      .userId(dsMstrDTO.getUserId())
      .password(dsMstrDTO.getPassword())
      .port(dsMstrDTO.getPort())
      .dbmsType(dsMstrDTO.getDbmsType().toString())
      .ownerNm(dsMstrDTO.getOwnerNm())
      .dsDesc(dsMstrDTO.getDsDesc())
      .connector(dsMstrDTO.getConnector())
      .userAreaYn(dsMstrDTO.getUserAreaYn())
      .hashYn(dsMstrDTO.getHashYn())
      .build();
  }
}
