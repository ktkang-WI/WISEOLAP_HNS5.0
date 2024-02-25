package com.wise.MarketingPlatForm.account.dto.user;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDsPutDTO {
  int userNo;
  List<Integer> dsIds;
}
