package com.wise.MarketingPlatForm.report.domain.data.data;

import org.apache.ibatis.type.Alias;

import com.wise.MarketingPlatForm.report.type.SummaryType;

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
@Alias("ItemMeasure")
public class Measure {
  String caption;
  String name;
  String uniqueName;
  SummaryType summaryType;
  String fieldId;
  String category;
  String summaryName;
  
  public Measure (String caption, String name, String uniqueName, SummaryType summaryType, String fieldId, String category) {
    this.caption = caption;
    this.name = name;
    this.uniqueName = uniqueName;
    this.summaryType = summaryType;
    this.fieldId = fieldId;
    this.category = category;
  }
}
