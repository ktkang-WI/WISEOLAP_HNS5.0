package com.wise.MarketingPlatForm.mart;

import org.apache.ibatis.plugin.Intercepts;
import com.wise.MarketingPlatForm.global.util.DataField;
import com.wise.MarketingPlatForm.global.util.JavaxtUtils;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.mart.vo.MetaDTO;
import org.apache.ibatis.executor.resultset.ResultSetHandler;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import org.apache.ibatis.plugin.*;
import java.util.*;

/**
*
* 
* @author 임성현
* @version 1.0
* @lastUpdateDate 2023-08-24
* 
* @name intercept
* @explain Mybatis Select 함수 동작시 중간에서 InterCept 하는 기능
* Mart연결 mybatis-mart-config.xml 파일에 플러그인 등록필요
* 
* @Signature 설정시 type으로 설정할수 있는것
* Executor.class, ParameterHandler.class, ResultSetHandler.class, StatementHandler.class
*/
@Intercepts({@Signature(type = ResultSetHandler.class, method = "handleResultSets", args = {Statement.class})})
public class MartInterceptor implements Interceptor {
	
	@Override
    public List<MartResultDTO> intercept(Invocation invocation) throws Throwable {
        List<MartResultDTO> returnValue = new ArrayList<MartResultDTO>();
        Object[] args = invocation.getArgs();
        Statement statement = (Statement) args[0];
        ResultSet rs;
        
        while ((rs = statement.getResultSet()) == null && statement.getMoreResults()) {
            if (statement.getUpdateCount() == -1) {
                break;
            }
        }
        
        if (rs != null) {
            ResultSetMetaData rsmd = rs.getMetaData();
            int columnCount = rsmd.getColumnCount();
            List<MetaDTO> metaData = new ArrayList<MetaDTO>();
            
            // MetaData
            for (int i = 1; i <= columnCount; i++) {
            	MetaDTO columnMeta = new MetaDTO();
                columnMeta.setColumnName(rsmd.getColumnName(i));
                columnMeta.setColumnLabel(rsmd.getColumnLabel(i));
                columnMeta.setColumnType(String.valueOf(rsmd.getColumnType(i)));
                columnMeta.setColumnTypeName(rsmd.getColumnTypeName(i));
                metaData.add(columnMeta);
            }
            
            // Mart Data
            List<Map<String, Object>> rowData = new ArrayList<>();
            while (rs.next()) {
            	Map<String, Object> row = new HashMap<>();
            	for (int i = 1; i <= columnCount; i++) {
            		DataField field =  new DataField(i, rsmd, rs.getObject(i));
            		row.put(rsmd.getColumnLabel(i), JavaxtUtils.getValue(field));
            	}
            	rowData.add(row);
            }
            MartResultDTO mart = new MartResultDTO();
            mart.setMetaData(metaData);
            mart.setRowData(rowData);
            returnValue.add(mart);
        }
        return returnValue;
    }

    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties properties) {

    }

}
