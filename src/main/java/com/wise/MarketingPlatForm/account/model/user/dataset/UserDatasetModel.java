package com.wise.MarketingPlatForm.account.model.user.dataset;

import java.util.List;

import com.wise.MarketingPlatForm.account.entity.FldMstrEntity;
import com.wise.MarketingPlatForm.account.entity.UserMstrEntity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDatasetModel {
  UserMstrEntity user;
  List<FldMstrEntity> dataset;
}
