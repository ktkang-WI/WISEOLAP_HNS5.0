package com.wise.MarketingPlatForm.dataset.vo;

import com.wise.MarketingPlatForm.dataset.entity.UserUploadMstrEntity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class UserUploadMstrDTO {
  int dataSeq;
  String dataNm;
  String tableNm;
  int regUserNo;
  String dataDesc;
  String uploadXml;
  int dsId;

  public static UserUploadMstrEntity toEntity(UserUploadMstrDTO userUploadMstrDTO) {
    return UserUploadMstrEntity.builder()
      .dataSeq(userUploadMstrDTO.getDataSeq())
      .dataNm(userUploadMstrDTO.getDataNm())
      .tableNm(userUploadMstrDTO.getTableNm())
      .regUserNo(userUploadMstrDTO.getRegUserNo())
      .dataDesc(userUploadMstrDTO.getDataDesc())
      .uploadXml(userUploadMstrDTO.getUploadXml())
      .dsId(userUploadMstrDTO.getDsId())
      .build();
  }

}
