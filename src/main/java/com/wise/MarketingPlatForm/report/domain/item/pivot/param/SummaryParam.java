package com.wise.MarketingPlatForm.report.domain.item.pivot.param;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.wise.MarketingPlatForm.report.type.SummaryType;

public class SummaryParam {

    private String selector;
    private SummaryType summaryType = SummaryType.SUM;

    public SummaryParam() {

    }

    public SummaryParam(final String selector, final SummaryType summaryType) {
        this.selector = selector;
        this.summaryType = summaryType;
    }

    public String getSelector() {
        return selector;
    }

    public void setSelector(String selector) {
        this.selector = selector;
    }

    public SummaryType getSummaryType() {
        return summaryType;
    }

    public void setSummaryType(SummaryType summaryType) {
        this.summaryType = summaryType;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof SummaryParam)) {
            return false;
        }

        final SummaryParam that = (SummaryParam) o;

        if (!StringUtils.equals(selector, that.selector)) {
            return false;
        }

        if (summaryType != that.summaryType) {
            return false;
        }

        return true;
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder().append(selector).append(summaryType).toHashCode();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this).append("selector", selector)
                .append("summaryType", summaryType).toString();
    }
}
