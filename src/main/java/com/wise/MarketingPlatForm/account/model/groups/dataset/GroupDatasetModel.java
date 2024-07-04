package com.wise.MarketingPlatForm.account.model.groups.dataset;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupDatasetModel {
  Integer grpId;
  List<Integer> fldId;
}
