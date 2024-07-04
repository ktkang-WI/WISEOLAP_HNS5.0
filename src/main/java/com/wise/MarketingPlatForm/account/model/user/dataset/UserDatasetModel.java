package com.wise.MarketingPlatForm.account.model.user.dataset;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDatasetModel {
  Integer userNo;
  List<Integer> fldId;
}
