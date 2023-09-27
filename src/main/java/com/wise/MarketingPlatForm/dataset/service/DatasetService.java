package com.wise.MarketingPlatForm.dataset.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.dataset.type.DBMSType;
import com.wise.MarketingPlatForm.dataset.type.DSType;
import com.wise.MarketingPlatForm.dataset.vo.DBColumnVO;
import com.wise.MarketingPlatForm.dataset.vo.DBTableVO;
import com.wise.MarketingPlatForm.dataset.vo.DSMstrDTO;
import com.wise.MarketingPlatForm.dataset.vo.DatasetFieldVO;

@Service
public class DatasetService {
  public List<DSMstrDTO> getDataSources(String userId) {
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

  public List<DBTableVO> getDBTables(String dsId, String search) {
    return null;
  }

  public List<DBColumnVO> getDBColumns(String dsId, String table, String search) {
    return null;
  }

  // TODO: 추후 필터 정보도 받아와야 함.
  public List<DatasetFieldVO> getDatasetFields(String dsId, DSType dsType, String query) {
    return null;
  }
}
