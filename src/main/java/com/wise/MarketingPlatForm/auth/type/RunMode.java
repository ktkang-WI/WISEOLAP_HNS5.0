package com.wise.MarketingPlatForm.auth.type;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum RunMode {
  ADMIN("ADMIN"), VIEW("VIEW");

  private final String symbol;

	RunMode (String symbol) { this.symbol = symbol; }

  private static final Map<String, RunMode> stringToEnum =
		Stream.of(values()).collect(
			Collectors.toMap(Object::toString, e -> e));

  /**
   * 문자열에 상응하는 RunMode가 있는 경우 반환합니다.
   * @param symbol
   * @return RunMode
   */
  public static Optional<RunMode> fromString(String symbol) {
    return Optional.ofNullable(stringToEnum.get(symbol));
  }

  @Override public String toString() { return symbol; }
}
