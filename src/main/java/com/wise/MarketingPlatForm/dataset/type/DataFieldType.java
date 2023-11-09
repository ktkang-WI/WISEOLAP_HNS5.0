package com.wise.MarketingPlatForm.dataset.type;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum DataFieldType {
  MEASURE("measure"), DIMENSION("dimension"), FIELD("field"), SPARKLINE("sparkline");

  private final String symbol;

  DataFieldType (String symbol) { this.symbol = symbol; }

  private static final Map<String, DataFieldType> stringToEnum =
		Stream.of(values()).collect(
			Collectors.toMap(Object::toString, e -> e));

  /**
   * 문자열에 상응하는 DataFieldType이 있는 경우 반환합니다.
   * @param symbol
   * @return DataFieldType
   */
  public static Optional<DataFieldType> fromString(String symbol) {
    return Optional.ofNullable(stringToEnum.get(symbol));
  }

  @Override public String toString() { return symbol; }
}
