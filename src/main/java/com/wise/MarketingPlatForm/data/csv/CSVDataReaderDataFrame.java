package com.wise.MarketingPlatForm.data.csv;

import java.util.Iterator;

import org.apache.commons.csv.CSVRecord;

import com.wise.MarketingPlatForm.report.domain.item.pivot.model.DataFrame;
import com.wise.MarketingPlatForm.report.domain.item.pivot.model.DataRow;

public class CSVDataReaderDataFrame implements DataFrame {

    private final CSVDataReader csvDataReader;
    private final String[] columnNames;

    public CSVDataReaderDataFrame(final CSVDataReader csvDataReader) {
        this.csvDataReader = csvDataReader;
        this.columnNames = csvDataReader.getHeaders().toArray(new String[0]);
    }

    public String[] getColumnNames() {
        return columnNames.clone();
    }

    public Iterator<DataRow> iterator() {
        return new DataRowIterator(csvDataReader.iterator());
    }

    private class DataRowIterator implements Iterator<DataRow> {

        private final Iterator<CSVRecord> recordIt;

        private DataRowIterator(final Iterator<CSVRecord> recordIt) {
            this.recordIt = recordIt;
        }

        @Override
        public boolean hasNext() {
            return recordIt.hasNext();
        }

        @Override
        public DataRow next() {
            return new CSVRecordDataRow(recordIt.next());
        }
    }
}
