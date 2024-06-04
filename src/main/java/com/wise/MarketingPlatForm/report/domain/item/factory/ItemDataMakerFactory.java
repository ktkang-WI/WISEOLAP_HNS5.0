package com.wise.MarketingPlatForm.report.domain.item.factory;

import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.ArcDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.BoxPlotDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.CalendarDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.CardDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.ChartDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.ChordDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.ChoroplethDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.CirclePackingDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.CollapsibleTreeMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.CoordinateChartDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.DataGridDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.LiquidFillGaugeDataMakter;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.PieChartDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.PivotGridDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.RadialTreeMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.SunburstChartMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.TimelineDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.TreeMapDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.WordCloudMaker;
import com.wise.MarketingPlatForm.report.domain.item.datamaker.ZoomableIcicleDataMaker;
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
        if (itemType == ItemType.CHORD) {
            return new ChordDataMaker();
        }
        if (itemType == ItemType.TREEMAP) {
            return new TreeMapDataMaker();
        }
        if (itemType == ItemType.CARD) {
            return new CardDataMaker();
        }
        if (itemType == ItemType.LIQUID_FILL_GAUGE) {
            return new LiquidFillGaugeDataMakter();
        }
        if (itemType == ItemType.CHOROPLETH) {
            return new ChoroplethDataMaker();
        }
        if (itemType == ItemType.CALENDAR) {
            return new CalendarDataMaker();
        }
        if (itemType == ItemType.ARC_DIAGRAM) {
            return new ArcDataMaker();
        }
        if (itemType == ItemType.COORDINATE_DOT ||
            itemType == ItemType.COORDINATE_LINE) {
            return new CoordinateChartDataMaker();
        }
        if (itemType == ItemType.COLLAPSIBLE_TREE) {
            return new CollapsibleTreeMaker();
        }
        if (itemType == ItemType.RADIAL_TREE) {
            return new RadialTreeMaker();
        }
        if (itemType == ItemType.WORDCLOUD) {
            return new WordCloudMaker();
        }
        if (itemType == ItemType.SUNBURST_CHART) {
            return new SunburstChartMaker();
        }
        if (itemType == ItemType.ZOOMABLE_CICLE) {
            return new ZoomableIcicleDataMaker();
        }
        if (itemType == ItemType.CICLE_PACKING) {
            return new CirclePackingDataMaker();
        }

        throw new IllegalArgumentException();
    }
}
