package com.wise.MarketingPlatForm.account.model.groups.ds;

import java.util.List;

import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupDsModel {
  GroupMstrEntity group;
  List<DsMstrEntity> ds;
}
