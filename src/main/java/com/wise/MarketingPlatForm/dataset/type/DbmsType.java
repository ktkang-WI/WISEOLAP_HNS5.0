package com.wise.MarketingPlatForm.dataset.type;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum DBMSType {
  ORACLE("ORACLE", "oracle.jdbc.driver.OracleDriver"), 
  MS_SQL("MS-SQL", "com.microsoft.sqlserver.jdbc.SQLServerDriver"), 
  TIBERO("TIBERO", "com.tmax.tibero.jdbc.TbDriver"), 
  MARIA("MARIA", "org.mariadb.jdbc.Driver"),
  MY_SQL("MYSQL", "추후 추가"),
  VERTICA("VERTICA", "com.vertica.jdbc.Driver"), 
  CUBRID("CUBRID", "cubrid.jdbc.driver.CUBRIDDriver"), 
  DB2("DB2BLU", "com.ibm.db2.jcc.DB2Driver"),
  IMPALA("IMPALA", "com.cloudera.impala.jdbc41.Driver"), 
  POSTGRES("POSTGRES", "org.postgresql.Driver"), 
  SAPIQ("SAPIQ", "추후 추가");

  private final String symbol;
  private final String driver;

	DBMSType (String symbol, String driver) { 
		this.symbol = symbol; 
		this.driver = driver;	
	}

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
  
  public String getDriver() { return driver; }
}
