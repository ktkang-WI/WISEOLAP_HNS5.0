package com.wise.MarketingPlatForm.account.model.groups.dataset;

import java.util.List;

import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.entity.FldMstrEntity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupDatasetModel {
  UserGroupDTO group;
  List<FldMstrEntity> dataset;
}
