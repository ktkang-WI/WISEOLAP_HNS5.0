package com.wise.MarketingPlatForm.report.domain.data;

import java.util.List;

import com.wise.MarketingPlatForm.report.domain.data.data.Dataset;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.PagingOption;
import com.wise.MarketingPlatForm.report.type.ItemType;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DataAggregation {
    String userId;
    List<Measure> measures;
    List<Dimension> dimensions;
    ItemType itemType;
    Dataset dataset;
    PagingOption pagingOption;
}
