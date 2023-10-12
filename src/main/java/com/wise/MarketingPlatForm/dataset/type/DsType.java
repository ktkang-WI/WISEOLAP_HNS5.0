package com.wise.MarketingPlatForm.dataset.type;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum DsType {
  DS_SQL("DS_SQL"), DS("DS"), DS_SINGLE("DS_SINGLE"), CUBE("CUBE");

  private final String symbol;

	DsType (String symbol) { this.symbol = symbol; }

  private static final Map<String, DsType> stringToEnum =
		Stream.of(values()).collect(
			Collectors.toMap(Object::toString, e -> e));

  /**
   * 문자열에 상응하는 DSType이 있는 경우 반환합니다.
   * @param symbol
   * @return DSType
   */
  public static Optional<DsType> fromString(String symbol) {
    return Optional.ofNullable(stringToEnum.get(symbol));
  }

  @Override public String toString() { return symbol; }
}
