package com.wise.MarketingPlatForm.report.type;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum EditMode {
    DESIGNER("designer"), VIEWER("viewer"), CONFIG("config");

    private final String symbol;

    EditMode(String symbol) {
        this.symbol = symbol;
    }

    private static final Map<String, EditMode> stringToEnum = Stream.of(values()).collect(
            Collectors.toMap(Object::toString, e -> e));

    /**
     * 문자열에 상응하는 EditMode 있는 경우 반환합니다.
     * 
     * @param symbol
     * @return EditMode
     */
    public static Optional<EditMode> fromString(String symbol) {
        return Optional.ofNullable(stringToEnum.get(symbol));
    }

    @Override
    public String toString() {
        return symbol;
    }
}
