package com.wise.MarketingPlatForm.account.model.user.data;


import java.util.List;

import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.model.groups.data.DataModel;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDataModel {
  UserGroupDTO user;
  List<DataModel> datas;
}
