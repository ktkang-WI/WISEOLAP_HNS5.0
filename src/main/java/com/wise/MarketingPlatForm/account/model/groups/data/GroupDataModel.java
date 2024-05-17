package com.wise.MarketingPlatForm.account.model.groups.data;

import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.model.common.DataSetXmlModel;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupDataModel {
  UserGroupDTO group;
  DataSetXmlModel dsViews;
}
