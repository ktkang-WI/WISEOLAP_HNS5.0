package com.wise.MarketingPlatForm.account.model.groups.data;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupDataModel {
  Integer grpId;
  List<DataModel> datas;
}
