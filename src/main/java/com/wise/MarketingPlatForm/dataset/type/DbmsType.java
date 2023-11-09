package com.wise.MarketingPlatForm.dataset.type;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;

public enum DbmsType {
  ORACLE("ORACLE", "oracle.jdbc.driver.OracleDriver", "jdbc:oracle:thin:@~DatabaseIp:~DatabasePort~ConnPrefix~DatabaseName"), 
  MS_SQL("MS-SQL", "com.microsoft.sqlserver.jdbc.SQLServerDriver", "jdbc:sqlserver://~DatabaseIp:~DatabasePort;DatabaseName=~DatabaseName"), 
  TIBERO("TIBERO", "com.tmax.tibero.jdbc.TbDriver", "jdbc:tibero:thin:@~DatabaseIp:~DatabasePort:~DatabaseName"), 
  MARIA("MARIA", "org.mariadb.jdbc.Driver","jdbc:mariadb://~DatabaseIp:~DatabasePort/~DatabaseName"),
  MY_SQL("MYSQL", "추후 추가", "추후 추가"),
  VERTICA("VERTICA", "com.vertica.jdbc.Driver", "jdbc:vertica://~DatabaseIp:~DatabasePort/~DatabaseName"), 
  CUBRID("CUBRID", "cubrid.jdbc.driver.CUBRIDDriver", "jdbc:cubrid:~DatabaseIp:~DatabasePort:~DatabaseName:dba::"), 
  DB2("DB2BLU", "com.ibm.db2.jcc.DB2Driver", "jdbc:db2://~DatabaseIp:~DatabasePort/~DatabaseName"),
  IMPALA("IMPALA", "com.cloudera.impala.jdbc41.Driver", "jdbc:impala://~DatabaseIp:~DatabasePort/~DatabaseName"), 
  POSTGRES("POSTGRES", "org.postgresql.Driver", "jdbc:postgresql://~DatabaseIp:~DatabasePort/~DatabaseName"), 
  SAPIQ("SAPIQ", "추후 추가", "추후 추가");

  private final String symbol;
  private final String driver;
  private final String url;
  
  DbmsType (String symbol, String driver, String url) { 
	this.symbol = symbol; 
	this.driver = driver;	
	this.url = url;
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
 
  public String getUrl(DsMstrDTO dsMstrDTO) { 
	final String DATABASE_IP = "~DatabaseIp";
	final String DATABASE_PORT = "~DatabasePort";
	final String DATABASE_NAME = "~DatabaseName";
	final String CONN_PREFIX = "~ConnPrefix";
	String returnUrl = dsMstrDTO.getDbmsType().url;
	
	if("ORACLE".equals(this.symbol)) {
		String connPrefix = ("SID".equals(dsMstrDTO.getConnectorType())) ? ":" : "/";
		returnUrl = returnUrl.replaceAll(CONN_PREFIX, connPrefix);
	}
	returnUrl = returnUrl.replaceAll(DATABASE_IP, dsMstrDTO.getIp());
	returnUrl = returnUrl.replaceAll(DATABASE_PORT, dsMstrDTO.getPort());
	returnUrl = returnUrl.replaceAll(DATABASE_NAME, dsMstrDTO.getDbNm());

	return returnUrl; 
  }
}
