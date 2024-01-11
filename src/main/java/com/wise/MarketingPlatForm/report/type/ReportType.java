package com.wise.MarketingPlatForm.report.type;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum ReportType {
    ALL("All"), DASH_ANY("DashAny"), AD_HOC("AdHoc"), EXCEL("Excel");

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
	  if("Spread".equals(symbol)) return Optional.ofNullable(stringToEnum.get("Excel"));
    return Optional.ofNullable(stringToEnum.get(symbol));
  }

  public List<String> toStrList() {
    List<String> list = new ArrayList<>();
    if (this.equals(ALL)) {
        for (ReportType val : values()) {
            list.add(val.toString());
        }
        list.add("Spread");
    } else if (this.equals(EXCEL)) {
        list.add("Spread");
        list.add(this.symbol);
    } else {
        list.add(this.toString());
    }

    return list;
  }
  @Override public String toString() { return symbol; }
}
