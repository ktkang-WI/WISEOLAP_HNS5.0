package com.wise.MarketingPlatForm.account.model.groups.ds;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupDsModel {
  Integer grpId;
  List<Integer> dsIds;
}
