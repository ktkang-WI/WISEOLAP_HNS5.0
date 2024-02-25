package com.wise.MarketingPlatForm.account.model.user.dataset;

import java.util.List;

import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.config.entity.FldMstrEntity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDatasetModel {
  UserGroupDTO user;
  List<FldMstrEntity> dataset;
}
