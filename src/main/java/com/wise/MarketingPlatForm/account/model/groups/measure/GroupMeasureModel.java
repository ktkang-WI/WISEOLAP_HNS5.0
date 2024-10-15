package com.wise.MarketingPlatForm.account.model.groups.measure;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupMeasureModel {
  Integer grpId;
  List<MeasureModel> datas;
}
