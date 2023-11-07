package com.wise.MarketingPlatForm.report.domain.result.result;

import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.SummaryMatrix;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PivotResult implements ReportResult {
    SummaryMatrix matrix;
    String query;
}
