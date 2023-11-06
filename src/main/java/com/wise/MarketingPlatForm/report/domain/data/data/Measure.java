package com.wise.MarketingPlatForm.report.domain.data.data;

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
public class Measure {
  String caption;
  String name;
  String uniqueName;
  SummaryType summaryType;
  String fieldId;
  String category;
}
