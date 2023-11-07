package com.wise.MarketingPlatForm.data.map;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.wise.MarketingPlatForm.report.domain.item.pivot.model.AbstractDataRow;

public class ObjectNodeDataRow extends AbstractDataRow {

	private final ObjectNode record;

    public ObjectNodeDataRow(final ObjectNode objectNode) {
        this.record = objectNode;
    }

    @Override
    public String getInternalStringValue(final String columnName) {
        return record.has(columnName) ? record.get(columnName).asText() : null;
    }
}
