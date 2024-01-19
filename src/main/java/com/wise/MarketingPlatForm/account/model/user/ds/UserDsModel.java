package com.wise.MarketingPlatForm.account.model.user.ds;

import java.util.List;

import com.wise.MarketingPlatForm.account.entity.UserMstrEntity;
import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDsModel {
  UserMstrEntity user;
  List<DsMstrEntity> ds;
}
