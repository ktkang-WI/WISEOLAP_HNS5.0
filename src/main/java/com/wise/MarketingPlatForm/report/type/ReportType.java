package com.wise.MarketingPlatForm.report.type;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum ReportType {
    DASH_ANY("DashAny"), AD_HOC("AdHoc"), EXCEL("Excel");

    private final String symbol;

	ReportType (String symbol) { this.symbol = symbol; }

    private static final Map<String, ReportType> stringToEnum =
		Stream.of(values()).collect(
			Collectors.toMap(Object::toString, e -> e));

  /**
   * 문자열에 상응하는 ReportType 있는 경우 반환합니다.
   * @param symbol
   * @return ReportType
   */
  public static Optional<ReportType> fromString(String symbol) {
    return Optional.ofNullable(stringToEnum.get(symbol));
  }

  @Override public String toString() { return symbol; }
}
