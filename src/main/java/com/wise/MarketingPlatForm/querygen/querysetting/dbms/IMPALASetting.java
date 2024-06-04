package com.wise.MarketingPlatForm.querygen.querysetting.dbms;

import com.wise.MarketingPlatForm.querygen.querysetting.DBSetting;

public class IMPALASetting implements DBSetting{

	public IMPALASetting(){}
	public String vbCrLf = "\r\n";

	@Override
	public String DsDsViewOrderByRandomClause()
	{
		String sOrderBy = "";

		sOrderBy = "ORDER BY SYS_GUID()";

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

		sQuery = sQuery + vbCrLf + "SELECT cast(" + aKeyColNm + " as VARCHAR) KEY_VALUE , cast(" + aCaptionColNm + " as VARCHAR) CAPTION_VALUE";
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

		sAliasNm = aColumnNm;

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

		query.append(" SHOW TABLES LIKE 't_wise_*'									 ");
	
		return query.toString();
	}
}
