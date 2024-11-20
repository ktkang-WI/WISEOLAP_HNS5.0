package com.wise.MarketingPlatForm.mart.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PortalCardQueryMstrVO {
    String type;
    String query;
    String auth;
    int dsId;
}
