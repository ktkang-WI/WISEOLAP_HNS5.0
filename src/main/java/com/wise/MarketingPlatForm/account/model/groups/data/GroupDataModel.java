package com.wise.MarketingPlatForm.account.model.groups.data;

import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.account.model.common.DataSetXmlModel;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupDataModel {
  GroupMstrEntity group;
  DataSetXmlModel dsViews;
}
