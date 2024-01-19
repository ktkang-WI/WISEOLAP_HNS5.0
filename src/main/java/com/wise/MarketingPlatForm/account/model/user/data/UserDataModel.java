package com.wise.MarketingPlatForm.account.model.user.data;

import java.util.List;

import com.wise.MarketingPlatForm.account.entity.UserMstrEntity;
import com.wise.MarketingPlatForm.account.model.common.DataSetXmlModel;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDataModel {
  UserMstrEntity user;
  DataSetXmlModel dsViews;
}
