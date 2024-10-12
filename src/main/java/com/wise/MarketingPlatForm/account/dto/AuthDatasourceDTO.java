package com.wise.MarketingPlatForm.account.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthDatasourceDTO {
  int fldId;
  @Builder.Default
  String authDatasource = "";
}
