package com.wise.MarketingPlatForm.account.model.groups.measure;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeasureModel {
  int dsViewId;
  int cubeId;
  List<String> measures;
}
