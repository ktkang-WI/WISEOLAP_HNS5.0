package com.wise.MarketingPlatForm.account.model.user.ds;

import java.util.List;

import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDsModel {
  UserGroupDTO user;
  List<DsMstrEntity> ds;
}
