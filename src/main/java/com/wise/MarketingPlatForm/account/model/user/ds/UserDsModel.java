package com.wise.MarketingPlatForm.account.model.user.ds;

import java.util.List;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDsModel {
  Integer userNo;
  List<Integer> dsIds;
}
