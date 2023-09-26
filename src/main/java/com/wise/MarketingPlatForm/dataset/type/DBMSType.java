package com.wise.MarketingPlatForm.dataset.type;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum DBMSType {
  ORACLE("ORACLE"), MS_SQL("MS-SQL"), TIBERO("TIBERO"), MARIA("MARIA"),
  MY_SQL("MY-SQL");

  private final String symbol;

	DBMSType (String symbol) { this.symbol = symbol; }

  private static final Map<String, DBMSType> stringToEnum =
		Stream.of(values()).collect(
			Collectors.toMap(Object::toString, e -> e));

  /**
   * 문자열에 상응하는 DBMSType이 있는 경우 반환합니다.
   * @param symbol
   * @return DMBSType
   */
  public static Optional<DBMSType> fromString(String symbol) {
    return Optional.ofNullable(stringToEnum.get(symbol));
  }

  @Override public String toString() { return symbol; }
}
