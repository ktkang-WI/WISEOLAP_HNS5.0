package com.wise.MarketingPlatForm.report.domain.item.factory;

import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.BoxPlotDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.CardDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.ChartDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.ChordDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.ChroplethDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.DataGridDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.LiquidFillGaugeDataMakter;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.PieChartDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.PivotGridDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.TimelineDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.TreeMapDataMaker;
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
            result = new BoxPlotDataMaker();
        }
        if (itemType == ItemType.TIMELINE) {
            result = new TimelineDataMaker();
        }
        if (itemType == ItemType.CHORD) {
            result = new ChordDataMaker();
        }
        if (itemType == ItemType.TREEMAP) {
            result = new TreeMapDataMaker();
        }
        if (itemType == ItemType.CARD) {
            result = new CardDataMaker();
        }
        if (itemType == ItemType.LIQUID_FILL_GAUGE) {
            result = new LiquidFillGaugeDataMakter();
        }
        if (itemType == ItemType.CHOROPLETH) {
            result = new ChroplethDataMaker();
        }


        // Default Chart Maker 
        if (result == null) {
            throw new NullPointerException();
        }

        return result;
    }
}
