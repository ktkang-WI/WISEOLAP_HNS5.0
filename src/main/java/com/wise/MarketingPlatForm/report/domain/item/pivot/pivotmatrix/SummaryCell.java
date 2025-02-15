package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.wise.MarketingPlatForm.report.domain.item.pivot.model.SummaryValue;

public interface SummaryCell {

    public boolean hasSummaryValue();

    @JsonProperty(value = "vs")
    public List<SummaryValue> getSummaryValues();

    @JsonIgnore
    public List<Integer> getRowChildCellIndices();

    @JsonIgnore
    public List<Integer> getColChildCellIndices();

    @JsonIgnore
    public int getRowChildrenColIndex();

    @JsonIgnore
    public int getColChildrenRowIndex();
    
}
