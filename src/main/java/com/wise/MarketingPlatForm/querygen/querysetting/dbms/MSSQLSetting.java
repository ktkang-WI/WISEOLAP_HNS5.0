package com.wise.MarketingPlatForm.querygen.querysetting.dbms;

import com.wise.MarketingPlatForm.querygen.querysetting.DBSetting;

public class MSSQLSetting implements DBSetting {

	public MSSQLSetting(){}
	public String vbCrLf = "\r\n";

	@Override
	public String DsDsViewOrderByRandomClause()
	{
		String sOrderBy = "";

		sOrderBy = "ORDER BY NEWID()";

		return sOrderBy;
	}
	
	@Override
	public String ConvertFileNm(String aFileNm)
	{
		return "[" + aFileNm + "]";
	}
	
	@Override
	public String FilterQuery(String aTblNm, String aCaptionColNm, String aKeyColNm, String aSortType)
	{
		String sQuery = "";

		sQuery = sQuery + vbCrLf + "SELECT CONVERT(NVARCHAR," + aKeyColNm + ")  KEY_VALUE , CONVERT(NVARCHAR," + aCaptionColNm + ") CAPTION_VALUE";
		sQuery = sQuery + vbCrLf + "FROM   " + aTblNm;
		sQuery = sQuery + vbCrLf + "GROUP BY " + aKeyColNm + "," + aCaptionColNm;
		sQuery = sQuery + vbCrLf + "ORDER BY  KEY_VALUE " + aSortType;

		return sQuery;

	}
	
	@Override
	public String TblAliasNm(String aDimUniNm)
	{
		String sAliasNm = "";

		sAliasNm = aDimUniNm.replace("[", "").replace("]", "");

		return sAliasNm;

	}
	
	@Override
	public String ColumnAliasNm(String aColumnNm)
	{
		String sAliasNm = "";

		sAliasNm = "\"" + aColumnNm + "\"";

		return sAliasNm;

	}
	
	@Override
	public String GetAggregarion(String aAgg)
	{
		String sReturn = aAgg;

		if(sReturn.equalsIgnoreCase("VAR")) 
			sReturn = "VARIANCE";
		

		return sReturn;

	}

	@Override
	public String GetSelectMartTableSystemQuery()
	{
		StringBuilder query = new StringBuilder();

		query.append(" ");

		query.append(" SELECT  CAST(A.NAME AS NVARCHAR(200)) AS TABLE_NAME 			 ")
			 .append(" FROM	SYSOBJECTS A 											 ")
			 .append(" WHERE	A.xtype IN ('U', 'V') AND A.NAME LIKE 'T_WISE_%'	 ")
			 .append(" ORDER BY 1  													 ");
	
		return query.toString();
	}

}
