package com.wise.MarketingPlatForm.mart.vo;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PortalDataDTO {
    List<PortalTypeMstrVO> types;
    List<PortalReportMstrVO> reports;
    List<PortalCardQueryMstrVO> queries;
}
