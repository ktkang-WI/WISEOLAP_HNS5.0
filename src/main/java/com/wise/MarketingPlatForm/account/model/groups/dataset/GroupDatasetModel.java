package com.wise.MarketingPlatForm.account.model.groups.dataset;

import java.util.List;

import com.wise.MarketingPlatForm.account.entity.FldMstrEntity;
import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupDatasetModel {
  GroupMstrEntity group;
  List<FldMstrEntity> dataset;
}
