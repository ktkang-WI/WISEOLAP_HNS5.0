package com.wise.MarketingPlatForm.data.map;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.wise.MarketingPlatForm.report.domain.item.pivot.model.DataFrame;
import com.wise.MarketingPlatForm.report.domain.item.pivot.model.DataRow;

public class MapListDataFrame implements DataFrame {
	  private final List<Map<String, Object>> dataArray;
	    private final String[] columnNames;

	    public MapListDataFrame(final List<Map<String, Object>> dataArray, final String[] columnNames) {
	        this.dataArray = dataArray;
	        final int columnCount = columnNames.length;
	        this.columnNames = new String[columnCount];
	        System.arraycopy(columnNames, 0, this.columnNames, 0, columnCount);
	    }

	    public String[] getColumnNames() {
	        return columnNames.clone();
	    }

	    public Iterator<DataRow> iterator() {
	        return new DataRowIterator();
	    }

	    private class DataRowIterator implements Iterator<DataRow> {
	        private int index;

	        @Override
	        public boolean hasNext() {
	            return index < dataArray.size();
	        }

	        @Override
	        public DataRow next() {
	            return new MapDataRow(dataArray.get(index++));
	        }
	    }
}
