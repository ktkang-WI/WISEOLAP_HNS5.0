package com.wise.MarketingPlatForm.data.csv;

import org.apache.commons.csv.CSVRecord;

import com.wise.MarketingPlatForm.report.domain.item.pivot.model.AbstractDataRow;

public class CSVRecordDataRow extends AbstractDataRow {

    private final CSVRecord record;

    public CSVRecordDataRow(final CSVRecord record) {
        this.record = record;
    }

    @Override
    public String getInternalStringValue(final String columnName) {
        return record.get(columnName);
    }
}
