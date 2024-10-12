package com.wise.MarketingPlatForm.config.model;

import com.wise.MarketingPlatForm.account.model.common.ProgModel;
import com.wise.MarketingPlatForm.config.dto.config.AdvancedDTO;
import com.wise.MarketingPlatForm.config.dto.config.GeneralDTO;
import com.wise.MarketingPlatForm.config.dto.config.MenuDTO;
import com.wise.MarketingPlatForm.config.dto.config.ReportDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfigModel {
  private GeneralDTO general;
  private AdvancedDTO advanced;
  private MenuDTO menu;
  private ReportDTO report;
  private ProgModel prog;
}
