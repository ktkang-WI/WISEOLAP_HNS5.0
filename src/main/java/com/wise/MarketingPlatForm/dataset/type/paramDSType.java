package com.wise.MarketingPlatForm.dataset.type;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum paramDSType {
	TABLE("TBL"), QUERY("QUERY"), CALENDAR("CAND");

	private final String symbol;
	
	paramDSType (String symbol) { this.symbol = symbol; }
	
	private static final Map<String, paramDSType> stringToEnum =
		Stream.of(values()).collect(
			Collectors.toMap(Object::toString, e -> e));
	
	/**
	 * 문자열에 상응하는 DSType이 있는 경우 반환합니다.
	 * @param symbol
	 * @return paramDSType
	 */
	public static Optional<paramDSType> fromString(String symbol) {
	  return Optional.ofNullable(stringToEnum.get(symbol));
	}
	
	@Override public String toString() { return symbol; }
}
