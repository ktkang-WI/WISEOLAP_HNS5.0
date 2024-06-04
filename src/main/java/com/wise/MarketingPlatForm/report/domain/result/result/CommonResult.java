package com.wise.MarketingPlatForm.report.domain.result.result;

import java.util.List;
import java.util.Map;

import com.wise.MarketingPlatForm.report.domain.result.ReportResult;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommonResult extends ReportResult {
    List<Map<String, Object>> data;
    Map<String, Object> info;
}
