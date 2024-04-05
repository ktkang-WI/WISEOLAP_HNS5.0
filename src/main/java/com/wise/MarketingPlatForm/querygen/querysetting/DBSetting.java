package com.wise.MarketingPlatForm.querygen.querysetting;

import java.util.List;
import java.util.Map;

public interface DBSetting {

    public String DsDsViewOrderByRandomClause();
    public String ConvertFileNm(String aFileNm);
	public String FilterQuery(String aTblNm, String aCaptionColNm, String aKeyColNm, String aSortType);
	public String TblAliasNm(String aDimUniNm);
	public String ColumnAliasNm(String aColumnNm);
	public String GetAggregarion(String aAgg);
    public String GetSelectMartTableSystemQuery();
    
}
