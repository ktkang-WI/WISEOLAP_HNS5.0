package com.wise.MarketingPlatForm.report.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ReportBosEntity {
    @Builder.Default 
    private String msg = "보고서의 데이터가 BOS와 일치하지 않습니다.";
    @Builder.Default
    private String code = "200";
    @JsonProperty("isModified")
    @Builder.Default
    private boolean isModified = true;
}
