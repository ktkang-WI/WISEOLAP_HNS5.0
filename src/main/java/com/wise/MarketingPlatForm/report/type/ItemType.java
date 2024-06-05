package com.wise.MarketingPlatForm.report.type;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum ItemType {
    CHART("chart"),
    PIVOT_GRID("pivot"),
    DATA_GRID("grid"),
    PIE_CHART("pie"),
    AD_HOC("adHoc"),
    TREEMAP("treeMap"),
    CARD("card"),
    CHOROPLETH("choropleth"),
    CALENDAR("calendar"),
    LIQUID_FILL_GAUGE("liquidFillGauge"),
    BOX_PLOT("boxPlot"),
    TEXT_BOX("textBox"),
    TIMELINE("timeline"),
    CHORD("chord"),
    ARC_DIAGRAM("arc"),
    WORDCLOUD("wordCloud"),
    COORDINATE_DOT("coordinateDot"),
    COORDINATE_LINE("coordinateLine"),
    HEAT_MAP("heatMap"),
    COLLAPSIBLE_TREE("collapsibleTree"),
    RADIAL_TREE("radialTree"),
    ZOOMABLE_CICLE("zoomableCicle"),
    CICLE_PACKING("ciclePacking"),
    SCATTER_PLOT("scatterPlot"),
    SUNBURST_CHART("sunburstChart"),
    FUNNEL_CHART("funnelChart"),
    STAR_CHART("starChart")
    ;
    
    private final String symbol;

    ItemType(String symbol) {
        this.symbol = symbol;
    }

    private static final Map<String, ItemType> stringToEnum = Stream.of(values()).collect(
            Collectors.toMap(Object::toString, e -> e));

    /**
     * 문자열에 상응하는 ItemType 있는 경우 반환합니다.
     *
     * @param symbol
     * @return ItemType
     */
    public static Optional<ItemType> fromString(String symbol) {
        return Optional.ofNullable(stringToEnum.get(symbol));
    }

    @Override
    public String toString() {
        return symbol;
    }
}