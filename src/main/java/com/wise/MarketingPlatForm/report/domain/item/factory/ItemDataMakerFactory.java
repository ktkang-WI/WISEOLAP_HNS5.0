package com.wise.MarketingPlatForm.report.domain.item.factory;

import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.BoxPlotDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.ChartDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.DataGridDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.DefaultDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.PieChartDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.PivotGridDataMaker;
import com.wise.MarketingPlatForm.report.type.ItemType;

public class ItemDataMakerFactory {
    public ItemDataMaker getItemDataMaker(ItemType itemType) {
        ItemDataMaker result = null;
        if (itemType == ItemType.CHART) {
            result = new ChartDataMaker();
        }
        if (itemType == ItemType.PIVOT_GRID) {
            result = new PivotGridDataMaker();
        }
        if (itemType == ItemType.DATA_GRID) {
            result = new DataGridDataMaker();
        }
        if (itemType == ItemType.PIE_CHART) {
            result = new PieChartDataMaker();
        }
        if (itemType == ItemType.BOX_PLOT) {
            result =  new BoxPlotDataMaker();
        }

        // Default Chart Maker 
        if (result == null) {
            result = new DefaultDataMaker();
        }

        return result;
    }
}
