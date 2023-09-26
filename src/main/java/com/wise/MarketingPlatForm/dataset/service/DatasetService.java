package com.wise.MarketingPlatForm.dataset.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.dataset.type.DBMSType;
import com.wise.MarketingPlatForm.dataset.vo.DSMstrDTO;

@Service
public class DatasetService {
  public List<DSMstrDTO> getDataSourceList(String userId, String dsId) {
    List<DSMstrDTO> temp = new ArrayList<>();

    temp.add(DSMstrDTO.builder()
      .dsId(5142)
      .dsNm("테스트")
      .ip("123.456.789.10")
      .port("라면포트")
      .dbNm("가나다라1")
      .ownerNm("wise")
      .userId("홍길동")
      .userAreaYn("Y")
      .dsDesc("설명")
      .dbmsType(DBMSType.MARIA)
      .build());

    temp.add(DSMstrDTO.builder()
      .dsId(5142)
      .dsNm("테스트2")
      .ip("123.456.29.10")
      .port("74684")
      .dbNm("가나다라2")
      .ownerNm("wise")
      .userId("김철수")
      .userAreaYn("Y")
      .dsDesc("설명")
      .dbmsType(DBMSType.ORACLE)
      .build());

    temp.add(DSMstrDTO.builder()
      .dsId(5142)
      .dsNm("테스트3")
      .ip("123.456.789.120")
      .port("7887")
      .dbNm("가나다라")
      .ownerNm("wise")
      .userId("김영희")
      .userAreaYn("Y")
      .dsDesc("설명4342")
      .dbmsType(DBMSType.MS_SQL)
      .build());

    return temp;
  }
}
