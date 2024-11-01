package com.wise.MarketingPlatForm.report.domain.data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.report.domain.data.data.AdHocOption;
import com.wise.MarketingPlatForm.report.domain.data.data.Dataset;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.HavingClauseInfo;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.PagingOption;
import com.wise.MarketingPlatForm.report.domain.data.data.Parameter;
import com.wise.MarketingPlatForm.report.domain.data.data.PivotOption;
import com.wise.MarketingPlatForm.report.type.ItemType;
import com.wise.MarketingPlatForm.report.type.ReportType;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DataAggregation {
    UserDTO user;
    String userId;
    String reportId;
    ReportType reportType;
    List<Measure> measures;
    List<Measure> originalMeasures;
    List<Dimension> dimensions;
    List<Measure> sortByItems;
    ItemType itemType;
    Dataset dataset;
    PagingOption pagingOption;
    boolean removeNullData;
    List<Parameter> parameters;
    Map<String, List<String>> filter;
    AdHocOption adHocOption;
    PivotOption pivotOption;
    Map<String, HashMap<String, Object>> gridAttribute;
    List<HavingClauseInfo> havingClauseInfo;
}
