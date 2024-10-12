package com.wise.MarketingPlatForm.config.service.prog;

import org.springframework.stereotype.Service;
import com.wise.MarketingPlatForm.account.model.common.ProgModel;

@Service
public class ConfigProgService {
  public static ProgModel getDefaultProgModel() {
    ProgModel progModel = ProgModel.builder()
    .dashboard(false)
    .adhoc(false)
    .spreadSheet(false)
    .settings(false)
    .reportQueryPeriod(false)
    .viewQuery(false)
    .reportConfiguration(false)
    .cube(false)
    .dsSql(false)
    .dsSingle(false)
    .dsUpload(false)
    .build();

    return progModel;
  }
}
