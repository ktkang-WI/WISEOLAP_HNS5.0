package com.wise.MarketingPlatForm.data.map;

import java.util.Map;

import com.wise.MarketingPlatForm.report.domain.item.pivot.model.AbstractDataRow;

public class MapDataRow extends AbstractDataRow {

    private final Map<String, Object> record;

    public MapDataRow(final Map<String, Object> objectNode) {
        this.record = objectNode;
    }

    @Override
    public String getInternalStringValue(final String columnName) {
        return record.containsKey(columnName) ? String.valueOf(record.get(columnName)) : null;
    }
}
