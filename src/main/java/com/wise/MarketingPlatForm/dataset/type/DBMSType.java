package com.wise.MarketingPlatForm.dataset.type;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum DbmsType {
  ORACLE("ORACLE"), MS_SQL("MS-SQL"), TIBERO("TIBERO"), MARIA("MARIA"),
  MY_SQL("MYSQL"), VERTICA("VERTICA"), CUBRID("CUBRID"), DB2("DB2BLU"),
  IMPALA("IMPALA"), POSTGRES("POSTGRES"), SAPIQ("SAPIQ");

  private final String symbol;

	DbmsType (String symbol) { this.symbol = symbol; }

  private static final Map<String, DbmsType> stringToEnum =
		Stream.of(values()).collect(
			Collectors.toMap(Object::toString, e -> e));

  /**
   * 문자열에 상응하는 DBMSType이 있는 경우 반환합니다.
   * @param symbol
   * @return DMBSType
   */
  public static Optional<DbmsType> fromString(String symbol) {
    return Optional.ofNullable(stringToEnum.get(symbol));
  }

  @Override public String toString() { return symbol; }
}
