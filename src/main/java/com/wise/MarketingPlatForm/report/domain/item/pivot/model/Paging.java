package com.wise.MarketingPlatForm.report.domain.item.pivot.model;

import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Paging {

    private boolean pagingEnabled;
    private int offset;
    private int limit;
    private int count;
    private int total;
    private int distinctTotal;

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Paging)) {
            return false;
        }

        final Paging that = (Paging) o;

        return offset == that.offset && limit == that.limit && count == that.count
                && total == that.total && distinctTotal == that.distinctTotal;
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder().append(offset).append(limit).append(count).append(total)
                .append(distinctTotal).toHashCode();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this).append("offset", offset).append("limit", limit)
                .append("count", count).append("total", total)
                .append("distinctTotal", distinctTotal).toString();
    }
}
