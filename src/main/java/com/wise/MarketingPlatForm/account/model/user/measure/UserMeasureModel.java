package com.wise.MarketingPlatForm.account.model.user.measure;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMeasureModel {
  int userNo;
  List<DataModel> datas;
}
