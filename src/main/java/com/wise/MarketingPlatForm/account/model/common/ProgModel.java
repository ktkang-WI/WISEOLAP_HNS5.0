package com.wise.MarketingPlatForm.account.model.common;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
@JsonDeserialize(builder = ProgModel.ProgModelBuilder.class)
public class ProgModel {
  // SNBManagement
  Boolean dashboard;
  Boolean adhoc;
  Boolean spreadSheet;
  Boolean settings;
  @Builder.Default
  Boolean excelUploadResourceMap = false;
  // ReportManagement
  Boolean reportQueryPeriod;
  Boolean viewQuery;
  Boolean reportConfiguration;
  // Dataset
  Boolean cube;
  Boolean dsSql;
  Boolean dsSingle;
  Boolean dsUpload;

  @JsonPOJOBuilder(withPrefix = "")
  public static class ProgModelBuilder {
      // Lombok이 자동으로 빌더 메서드를 생성합니다.
  }

  // 병합 메서드 추가
  public static ProgModel merge(ProgModel model1, ProgModel model2) {
    return ProgModel.builder()
      .dashboard(model1.dashboard || model2.dashboard)
      .adhoc(model1.adhoc || model2.adhoc)
      .spreadSheet(model1.spreadSheet || model2.spreadSheet)
      .settings(model1.settings || model2.settings)
      .excelUploadResourceMap(model1.excelUploadResourceMap || model2.excelUploadResourceMap)
      .reportQueryPeriod(model1.reportQueryPeriod || model2.reportQueryPeriod)
      .viewQuery(model1.viewQuery || model2.viewQuery)
      .reportConfiguration(model1.reportConfiguration || model2.reportConfiguration)
      .cube(model1.cube || model2.cube)
      .dsSql(model1.dsSql || model2.dsSql)
      .dsSingle(model1.dsSingle || model2.dsSingle)
      .dsUpload(model1.dsUpload || model2.dsUpload)
      .build();
  }
}
