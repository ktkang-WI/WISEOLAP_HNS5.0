package com.wise.MarketingPlatForm.report.entity;

import com.wise.MarketingPlatForm.report.vo.ReportListDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportListEntity {
    int id;
    String name;
    int upperId;
    int ordinal;
    String reportType;
    String type;

    public ReportListDTO toDTO() {
        return ReportListDTO.builder()
            .id(id)
            .name(name)
            .upperId(upperId)
            .ordinal(ordinal)
            .reportType(reportType)
            .type(type)
            .build();
    }
}
