package com.wise.MarketingPlatForm.querygen.clauses;

import java.util.ArrayList;

import com.wise.MarketingPlatForm.querygen.dto.*;
import com.wise.MarketingPlatForm.querygen.service.SqlLiteral;

public class WhereStatement extends ArrayList<ArrayList<WhereClause>> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int ClauseLevels;

	private void AssertLevelExistance(int level) 
    {
        if (this.size() < (level - 1))
        {
            System.out.println("Level " + level + " not allowed because level " + (level - 1) + " does not exist.");
        }
        // Check if new level must be created
        else if (this.size() < level)
        {
            this.add(new ArrayList<WhereClause>());
        }
    }
	
	private void AddWhereClauseToLevel(WhereClause clause, int level)
    {
        // Add the new clause to the array at the right level
        AssertLevelExistance(level);
        this.get(level - 1).add(clause);
    }
	
	public void Add(WhereClause clause) { this.Add(clause, 1); }
	
	public void Add(WhereClause clause, int level)
	{
		this.AddWhereClauseToLevel(clause, level);
	}
    
	public WhereClause Add(String field, Comparison operator, Object compareValue, String valuetype, String paramName) 
	{ 
		return this.Add(field, operator, compareValue, 1, valuetype, paramName); 
	}
	
	public WhereClause Add(Enum field, Comparison operator, Object compareValue, String valuetype, String paramName) 
    { 
		return this.Add(field.toString(), operator, compareValue, 1, valuetype, paramName); 
    }
     
    public WhereClause Add(String field, Comparison operator, Object compareValue, int level, String valuetype, String paramName)
    {
        return Add(field, operator, compareValue, level, valuetype, paramName, LogicOperator.And);
    }

    public WhereClause Add(String field, Comparison operator, Object compareValue, int level, String valuetype, String paramName, LogicOperator aLogicOperator)
    {
        WhereClause NewWhereClause = new WhereClause(field, operator, compareValue, valuetype, paramName, aLogicOperator);
        this.AddWhereClauseToLevel(NewWhereClause, level);
        return NewWhereClause;
    }
    
    private void AddWhereClause(WhereClause clause)
    {
        AddWhereClauseToLevel(clause, 1);
    }

    public String BuildWhereStatement()
    {
        String Result = "";
        for(ArrayList<WhereClause> WhereStatement : this) // Loop through all statement levels, OR them together
        {
            String LevelWhere = "";
            String sLogicOperator = "";

            for (WhereClause oClause : WhereStatement) // Loop through all conditions, AND them together
            {
                String sWhereClause = "";

              /*  if (useCommandObject)
                {
                    // Create a parameter
                    String parameterName = String.Format(
                        "@p{0}_{1}",
                        usedDbCommand.Parameters.Count + 1,
                        Clause.FieldName.Replace('.', '_')
                        );

                    DbParameter parameter = usedDbCommand.CreateParameter();
                    parameter.ParameterName = parameterName;
                    parameter.Value = Clause.Value;
                    usedDbCommand.Parameters.Add(parameter);

                    // Create a where clause using the parameter, instead of its value
                    WhereClause += CreateComparisonClause(Clause.FieldName, Clause.ComparisonOperator, new SqlLiteral(parameterName), Clause.ValueType, Clause.ParamName);
                }*/
               // else
                //{
                sWhereClause = CreateComparisonClause(oClause.getM_FieldName(), oClause.getM_ComparisonOperator(), oClause.getM_Value(), oClause.getM_Value_Type(), oClause.getM_paramName());
               // }
                
                for(SubClause SubWhereClause : oClause.getM_SubClauses())	// Loop through all subclauses, append them together with the specified logic operator
                {

                    if(SubWhereClause.getLogicOperator().equals(LogicOperator.And))
                    {
                    	sWhereClause += " AND ";
                    }
                    else if (SubWhereClause.getLogicOperator().equals(LogicOperator.Or))
                    {
                    	sWhereClause += " OR "; 
                    }
                   /* if (useCommandObject)
                    {
                        // Create a parameter
                        String parameterName = String.Format(
                            "@p{0}_{1}",
                            usedDbCommand.Parameters.Count + 1,
                            Clause.FieldName.Replace('.', '_')
                            );

                        DbParameter parameter = usedDbCommand.CreateParameter();
                        parameter.ParameterName = parameterName;
                        parameter.Value = SubWhereClause.Value;
                        usedDbCommand.Parameters.Add(parameter);

                        // Create a where clause using the parameter, instead of its value
                        WhereClause += CreateComparisonClause(Clause.FieldName, SubWhereClause.ComparisonOperator, new SqlLiteral(parameterName), Clause.ValueType, Clause.ParamName);
                    }*/
                    else
                    {
                    	
                    	sWhereClause += CreateComparisonClause(oClause.getM_FieldName(), oClause.getM_ComparisonOperator(), oClause.getM_Value(), oClause.getM_Value_Type(), oClause.getM_paramName());
                    }
                }

                //LevelWhere += "(" + WhereClause + ") AND ";
                
                if(oClause.getM_LogicOperator().equals(LogicOperator.And))
                {
                	sLogicOperator += " AND ";
                }
                else if (oClause.getM_LogicOperator().equals(LogicOperator.Or))
                {
                	sLogicOperator += " OR "; 
                }
                
                
                if (LevelWhere.equals("") )
                    LevelWhere = "(" + sWhereClause + ")" ;
                else
                    LevelWhere += sLogicOperator + "(" + sWhereClause + ")";
            }

            // LevelWhere = LevelWhere.SubString(0, LevelWhere.Length - 5); // Trim de last AND inserted by foreach loop
            // LevelWhere = LevelWhere.SubString(0, LevelWhere.Length - sLogicOperator.Length ); // Trim de last AND inserted by foreach loop

            if (WhereStatement.size() > 1)
            {
                Result += " (" + LevelWhere + ") ";
            }
            else
            {
                Result += " " + LevelWhere + " ";
            }
            Result += " OR";
        }
        Result = Result.substring(0, Result.length() - 2); // Trim de last OR inserted by foreach loop

        return Result;
    }
    
    public static  String CreateComparisonClause(String fieldName, Comparison comparisonOperator, Object value, String valuetype, String paramName)
    {
        String Output = "";
        
        if (value.toString() != "null")
        {
            if (value != null && value != null)
            {
                if (valuetype == "PARAM")
                {
                    String sParamName = "";

                    if (paramName.equals(""))
                    {
                        sParamName = "@" + fieldName.replace(".", "_");
                    }
                    else
                    {
                        sParamName = paramName;
                    }
                    
                    switch (comparisonOperator)
                    {
                        case Equals:
                            Output = fieldName + " = " + sParamName; break;
                        case NotEquals:
                            Output = fieldName + " <> " + sParamName; break;
                        case GreaterThan:
                            Output = fieldName + " > " + sParamName; break;
                        case GreaterOrEquals:
                            Output = fieldName + " >= " + sParamName; break;
                        case LessThan:
                            Output = fieldName + " < " + sParamName; break;
                        case LessOrEquals:
                            Output = fieldName + " <= " + sParamName; break;
                        case Like:
                            Output = fieldName + " LIKE " + sParamName; break;
                        case NotLike:
                            Output = "NOT " + fieldName + " LIKE " + sParamName; break;
                        case In:
                            Output = fieldName + " IN (" + sParamName + ")"; break;
                        case IsNull:
                            Output = fieldName + " IS NULL"; break;
                        case NotIsNull:
                            Output = "NOT " + fieldName + " IS NULL"; break;
                        case NotIn:
                            Output = fieldName + " NOT IN (" + sParamName + ")"; break;
                        case Between:
                            Output = fieldName + " BETWEEN " + sParamName; break;
                        case And:
                        	Output = fieldName + " AND " + sParamName;break;
                        case Or:
                        	Output = fieldName + " OR " + sParamName;break;
                    }
                }
                else
                {
                	String formatSqlValue = "";
                    switch (comparisonOperator)
                    {
                        case Equals:
                            Output = fieldName + " = " + FormatSQLValue(value, valuetype, "Equals"); break;
                        case NotEquals:
                            Output = fieldName + " <> " + FormatSQLValue(value, valuetype, "NotEquals"); break;
                        case GreaterThan:
                            Output = fieldName + " > " + FormatSQLValue(value, valuetype, "GreaterThan"); break;
                        case GreaterOrEquals:
                            Output = fieldName + " >= " + FormatSQLValue(value, valuetype, "GreaterOrEquals"); break;
                        case LessThan:
                            Output = fieldName + " < " + FormatSQLValue(value, valuetype, "LessThan"); break;
                        case LessOrEquals:
                            Output = fieldName + " <= " + FormatSQLValue(value, valuetype, "LessOrEquals"); break;
                        case Like:
                            Output = fieldName + " LIKE " + FormatSQLValue(value, valuetype, "Like"); break;
                        case NotLike:
                            Output = "NOT " + fieldName + " LIKE " + FormatSQLValue(value, valuetype, "NotLike"); break;
                        case In:
                        	// 2021-05-12 yyb 오라클 in 조건 1000개 제한 처리
                        	// FormatSQLValue에서 구분자 | 로 넘어온다.
                        	formatSqlValue = FormatSQLValue(value, valuetype, "In");
                        	if (formatSqlValue.indexOf("|") != -1) {
                        		String[] arrVal = formatSqlValue.split("\\|");
                        		int nLen = arrVal.length;
                        		Output = "(" + fieldName + " IN (";
                                for (int i = 0; i < nLen; i++) {
                                	Output += arrVal[i] + ")";
                                	if (i != nLen - 1) {
                                		Output += " OR " + fieldName + " IN ("; 
                                	}
                                }
                                Output += ")";
                        	}
                        	else {
                        		Output = fieldName + " IN (" + formatSqlValue + ")";
                        	}
                            break;
                        case IsNull:
                            Output = fieldName + " IS NULL"; break;
                        case NotIsNull:
                            Output = "NOT " + fieldName + " IS NULL"; break;
                        case NotIn:
                        	// 2021-05-12 yyb 오라클 in 조건 1000개 제한 처리
                        	formatSqlValue = FormatSQLValue(value, valuetype, "In");
                        	if (formatSqlValue.indexOf("|") != -1) {
                        		String[] arrVal = formatSqlValue.split("\\|");
                        		int nLen = arrVal.length;
                        		Output = "(" + fieldName + " NOT IN (";
                                for (int i = 0; i < nLen; i++) {
                                	Output += arrVal[i] + ")";
                                	if (i != nLen - 1) {
                                		Output += " OR " + fieldName + " NOT IN ("; 
                                	}
                                }
                                Output += ")";
                        	}
                        	else {
                        		Output = fieldName + " NOT IN (" + formatSqlValue + ")";
                        	}
                            break;
                        case Between:
                            String[] Values = null;
                            
                            if(value.toString().indexOf("splitstring") > -1) {
                            	Values = value.toString().split("splitstring");
                            }else {
                            	Values = value.toString().split(",");
                            }

                            Output = fieldName + " BETWEEN " + FormatSQLValue(Values[0], valuetype, "Between") + " AND " + FormatSQLValue(Values[1], valuetype, "Between"); break;
                    }
                }

            }
            else // value==null	|| value==DBNull.Value
            {
                if ((comparisonOperator != Comparison.Equals) && (comparisonOperator != Comparison.NotEquals))
                {
                    System.out.println("Cannot use comparison operator " + comparisonOperator.toString() + " for NULL values.");
                }
                else
                {
                    switch (comparisonOperator)
                    {
                        case Equals:
                            Output = fieldName + " IS NULL"; break;
                        case NotEquals:
                            Output = "NOT " + fieldName + " IS NULL"; break;
						default:
							break;
                    }
                }
            }
        }
        else
        {
            if ((comparisonOperator != Comparison.Equals) && (comparisonOperator != Comparison.NotEquals) && (comparisonOperator != Comparison.NotIn) && (comparisonOperator != Comparison.In))
            {
                System.out.println("Cannot use comparison operator " + comparisonOperator.toString() + " for NULL values.");
            }
            else
            {
                switch (comparisonOperator)
                {
                    case Equals:
                        Output = fieldName + " IS NULL"; break;
                    case NotEquals:
                        Output = "NOT " + fieldName + " IS NULL"; break;
                    case In:
                        Output = fieldName + " IS NULL"; break;
                    case NotIn:
                        Output = "NOT " + fieldName + " IS NULL"; break;
					case Between:
						break;
					case GreaterOrEquals:
						break;
					case GreaterThan:
						break;
					case IsNull:
						break;
					case LessOrEquals:
						break;
					case LessThan:
						break;
					case Like:
						break;
					case NotIsNull:
						break;
					case NotLike:
						break;
					default:
						break;
                }
            }
        }
        return Output;
    }
    
    public static String FormatSQLValue(Object someValue, String valuetype, String comparisonOperator)
    {
        String FormattedValue = "";

        if (someValue == null)
        {
            FormattedValue = "NULL";
        }
        else
        {
            if (comparisonOperator == "In" || comparisonOperator == "NotIn")
            {
                String[] result;
                String[] charSeparators = new String[] { "," };
                
                if(((String)someValue.toString().replace("'", "''")).toString().indexOf("splitstring") > -1) {
                	charSeparators = new String[] { "splitstring" };
                }

                result = ((String)someValue.toString().replace("'", "''")).toString().split(charSeparators[0]);

                // 2021-05-12 yyb 오라클 in 조건 1000개 제한 처리
                int nLen = result.length;
                int nLimit = 1000;		// 테스트시 변경해서 처리할것
            	for (int ii = 0; ii <= nLen - 1; ii++)
                {
            		String sep = (ii % nLimit == 0) ? "|" : ",";	// 1000 단위로 구분자 | 붙임
            		
                	if(valuetype.equalsIgnoreCase("VARCHAR"))
                	{
                		// cjs_20160602 현재 데이터 구분자를 , 사용해서 ,->\b \b->, 처리 함 
                        String szTemp = result[ii];
                        szTemp = szTemp.replace("\"", "");
                        szTemp = szTemp.replace('\b', ',');
                        
                        if (FormattedValue.equals(""))
                        {
                    		FormattedValue = "'" + szTemp.replace("'", "''") + "'";
                        }
                        else
                        {
                        	
                            FormattedValue = FormattedValue + sep + "'" + szTemp.replace("'", "''") + "'";
                        }
                	}
                	else if(valuetype.equalsIgnoreCase("NUMBER"))
                	{
                		if (FormattedValue.equals(""))
                        {
                            FormattedValue = "" + ((String)result[ii]).replace("'", "''") + "";
                        }
                        else
                        {
                            FormattedValue = FormattedValue + sep + "" + ((String)result[ii]).replace("'", "''") + ""; 
                        }
                	}
                	else if(valuetype.equalsIgnoreCase("DateTime"))
                	{
                		if (FormattedValue.equals(""))
                        {
                            FormattedValue = "" + ((String)result[ii]).replace("'", "''") + "";
                        }
                        else
                        {
                            FormattedValue = FormattedValue + sep + "" + ((String)result[ii]).replace("'", "''") + ""; 
                        }
                	}
                	else if(valuetype.equalsIgnoreCase("DBNull"))
                	{
                		FormattedValue = "NULL";
                	}
                	else
                	{
                		 FormattedValue = someValue.toString();
                	}
                    
                }
                	
            }
            else
            {
            	if(valuetype.equalsIgnoreCase("VARCHAR"))
            	{
            		if (((String)someValue).contains("SYSDATE"))
                    {
                        FormattedValue = (String)someValue; 
                    }
                    else
                    {
                		FormattedValue = "'" + ((String)someValue).replace("'", "''") + "'";                    		
                    }
            	}
            	else if(valuetype.equalsIgnoreCase("NUMBER"))
            	{
            		FormattedValue = "" + ((String)someValue).replace("'", "''") + "";
            	}
            	else if(valuetype.equalsIgnoreCase("DateTime"))
            	{
                    String format = "";
                    switch (someValue.toString().length()) {
                        case 4:
                            format = "YYYY";
                            break;
                        case 6:
                            format = "YYYYMM";
                            break;
                        case 8:
                            format = "YYYYMMDD";
                            break;
                        case 7:
                            format = "YYYY-MM";
                            break;
                        case 10:
                            format = "YYYY-MM-DD";
                            break;
                        default:
                            format = "YYYYMMDD";
                            break;
                    }
                    
                    // TODO: 현재는 오라클 기준. 추후 다른 DB 추가 필요
                    return "TO_DATE(\'" + someValue.toString() + "\', \'" + format.toUpperCase() + "\')";
            	}
            	else if(valuetype.equalsIgnoreCase("DBNull"))
            	{
            		FormattedValue = "NULL";
            	}
            	else if(valuetype.equalsIgnoreCase("Boolean"))
            	{
            		 FormattedValue = Boolean.getBoolean((String)someValue) ? "1" : "0";
            	}
            	else if(valuetype.equalsIgnoreCase("SqlLiteral"))
            	{
            		 FormattedValue = ((SqlLiteral)someValue).get_value();
            	}
            	else
            	{
            		 FormattedValue = someValue.toString();
            	}
            	
            }
        }
        return FormattedValue;
    }
    
    public static WhereStatement CombineStatements(WhereStatement statement1, WhereStatement statement2)
    {
        // statement1: {Level1}((Age<15 OR Age>=20) AND (strEmail LIKE 'e%') OR {Level2}(Age BETWEEN 15 AND 20))
        // Statement2: {Level1}((Name = 'Peter'))
        // Return statement: {Level1}((Age<15 or Age>=20) AND (strEmail like 'e%') AND (Name = 'Peter'))

        // Make a copy of statement1
        WhereStatement result = WhereStatement.Copy(statement1);

        // Add all clauses of statement2 to result
        for (int i = 0; i < statement2.getClauseLevels(); i++) // for each clause level in statement2
        {
            ArrayList<WhereClause> level = statement2.get(i);
            for (WhereClause clause : level) // for each clause in level i
            {
                for (int j = 0; j < result.getClauseLevels(); j++)  // for each level in result, add the clause
                {
                    result.AddWhereClauseToLevel(clause, j);
                }
            }
        }

        return result;
    }

    public static WhereStatement Copy(WhereStatement statement)
    {
        WhereStatement result = new WhereStatement();
        int currentLevel = 0;
        for(ArrayList<WhereClause> level : statement)
        {
            currentLevel++;
            result.add(new ArrayList<WhereClause>());
            for (WhereClause clause : statement.get(currentLevel - 1))
            {
                WhereClause clauseCopy = new WhereClause(clause.getM_FieldName(), clause.getM_ComparisonOperator(), clause.getM_Value(), clause.getM_Value_Type(), clause.getM_paramName(), clause.getM_LogicOperator());
                ArrayList<SubClause> subClauseList = new ArrayList<SubClause> ();
                for(SubClause subClause : clause.getM_SubClauses())
                {
                	
                    SubClause subClauseCopy = new SubClause(subClause.getLogicOperator(), subClause.getComparisonOperator(), subClause.getValue(), subClause.getValue_Type(), subClause.getParam_Name());
                    subClauseList.add(subClauseCopy);

                }
                
                clauseCopy.setM_SubClauses(subClauseList);
                result.get(currentLevel - 1).add(clauseCopy);
            }
        }

        return result;
    }



	public int getClauseLevels() {
		return this.size();
	}

	public void setClauseLevels(int clauseLevels) {
		ClauseLevels = clauseLevels;
	}
	
	
}
