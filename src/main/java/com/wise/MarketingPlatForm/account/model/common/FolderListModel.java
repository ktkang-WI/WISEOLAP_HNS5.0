package com.wise.MarketingPlatForm.account.model.common;

import com.wise.MarketingPlatForm.config.entity.AuthReportMstrEntity;
import com.wise.MarketingPlatForm.config.entity.FldMstrEntity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FolderListModel {
  FldMstrEntity folder;
  AuthReportMstrEntity auth;
}
