package com.wise.MarketingPlatForm.report.domain.item.factory;

import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.BoxPlotDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.ChartDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.DataGridDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.PieChartDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.PivotGridDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.TimelineDataMaker;
import com.wise.MarketingPlatForm.report.type.ItemType;

public class ItemDataMakerFactory {
    public ItemDataMaker getItemDataMaker(ItemType itemType) {
        if (itemType == ItemType.CHART) {
            return new ChartDataMaker();
        }
        if (itemType == ItemType.PIVOT_GRID) {
            return new PivotGridDataMaker();
        }
        if (itemType == ItemType.DATA_GRID) {
            return new DataGridDataMaker();
        }
        if (itemType == ItemType.PIE_CHART) {
            return new PieChartDataMaker();
        }
        if (itemType == ItemType.BOX_PLOT) {
            return new BoxPlotDataMaker();
        }
        if (itemType == ItemType.TIMELINE) {
            return new TimelineDataMaker();
        }

        return null;
    }
}
