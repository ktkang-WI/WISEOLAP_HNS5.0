package com.wise.MarketingPlatForm.account.dto.group;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupDsPutDTO {
  int grpId;
  List<Integer> dsIds;
}
