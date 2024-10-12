package com.wise.MarketingPlatForm.account.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthReportDTO {
    int fldId;
    @Builder.Default
    String authPublish = "";
    @Builder.Default
    String authDatasource = "";
}
