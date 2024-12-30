package com.wise.MarketingPlatForm.report.type;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum SummaryType {
    SUM("SUM"), COUNT("COUNT"), COUNTDISTINCT("COUNTDISTINCT"), MIN("MIN"), MAX("MAX"), AVERAGE("AVERAGE"),
    CUSTOM("CUSTOM"), AVG("AVG"), NOFUNC("NOFUNC"), SUBQ("SUBQ"), SUBQTOTAL("SUBQTOTAL");

    private final String symbol;

    SummaryType(String symbol) {
        this.symbol = symbol;
    }

    private static final Map<String, SummaryType> stringToEnum = Stream.of(values()).collect(
            Collectors.toMap(Object::toString, e -> e));

    /**
     * 문자열에 상응하는 SummaryType 있는 경우 반환합니다.
     * 
     * @param symbol
     * @return SummaryType
     */
    public static Optional<SummaryType> fromString(String symbol) {
        return Optional.ofNullable(stringToEnum.get(symbol));
    }

    @Override
    public String toString() {
        return symbol;
    }
}