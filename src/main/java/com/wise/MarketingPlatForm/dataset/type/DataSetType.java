package com.wise.MarketingPlatForm.dataset.type;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum DataSetType {
	DATA_SET_CUBE("DataSetCube"), DATA_SET_DS("DataSetDs"), DATA_SET_SQL("DataSetSQL"), CUBE("CUBE"), DATA_SET_SINGLE_DS("DataSetSingleDs"), DATA_SET_SINGLE_DS_VIEW("DataSetSingleDsView");
		
	private final String symbol;
		
	DataSetType (String symbol) { this.symbol = symbol; }
		
	private static final Map<String, DataSetType> stringToEnum =
			Stream.of(values()).collect(
				Collectors.toMap(Object::toString, e -> e));
		
	/**
	 * 문자열에 상응하는 DataSetType이 있는 경우 반환합니다.
	 * @param symbol
	 * @return DataSetType
	 */
	public static Optional<DataSetType> fromString(String symbol) {
	  return Optional.ofNullable(stringToEnum.get(symbol));
	}
		
	@Override public String toString() { return symbol; }
}
