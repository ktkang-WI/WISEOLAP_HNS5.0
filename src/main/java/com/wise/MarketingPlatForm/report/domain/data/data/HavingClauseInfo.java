package com.wise.MarketingPlatForm.report.domain.data.data;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HavingClauseInfo {
    String type;
    String dataItem;
    String condition;
    String relationCondition;
    String valueFrom;
    String valueTo;
    String idx;
    String flag;
    String uniqueName;
    String summaryType;
}
