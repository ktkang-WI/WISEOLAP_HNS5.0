package com.wise.MarketingPlatForm.querygen.querysetting.dbms;

import com.wise.MarketingPlatForm.querygen.querysetting.DBSetting;

public class NETEZZASetting implements DBSetting{

	public NETEZZASetting(){}
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

		sQuery = sQuery + vbCrLf + "SELECT cast(" + aKeyColNm + " as NVARCHAR(4000)) \"KEY_VALUE\" , cast(" + aCaptionColNm + " as NVARCHAR(4000)) \"CAPTION_VALUE\"";
		sQuery = sQuery + vbCrLf + "FROM   " + aTblNm;
		sQuery = sQuery + vbCrLf + "GROUP BY " + aKeyColNm + "," + aCaptionColNm;
		sQuery = sQuery + vbCrLf + "ORDER BY  \"KEY_VALUE\"" + aSortType;

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
	public String GetSelectMartTableSystemQuery()
	{
		StringBuilder query = new StringBuilder();

		query.append(" ");

		query.append(" SELECT TABLENAME AS TABLE_NAME					")
			 .append(" FROM _V_TABLE											")
			 .append(" WHERE TABLE_NAME LIKE 'T_WISE_%'						")
			 .append(" ORDER BY 1							 				");
	
		return query.toString();
	}

	@Override
	public String GetAggregarion(String aAgg) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'GetAggregarion'");
	}

}
