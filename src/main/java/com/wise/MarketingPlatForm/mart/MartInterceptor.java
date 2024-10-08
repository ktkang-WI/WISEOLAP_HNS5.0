package com.wise.MarketingPlatForm.mart;

import com.wise.MarketingPlatForm.data.list.CloseableList;
import com.wise.MarketingPlatForm.data.list.FileBackedMapList;
import com.wise.MarketingPlatForm.global.util.DataField;
import com.wise.MarketingPlatForm.global.util.JavaxtUtils;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.mart.vo.MetaDTO;

import org.apache.ibatis.executor.resultset.ResultSetHandler;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import org.apache.ibatis.plugin.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
	
    private static final Logger logger = LoggerFactory.getLogger(MartInterceptor.class);

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
                columnMeta.setUniqueName(rsmd.getTableName(i));
                metaData.add(columnMeta);
            }
            
            logger.info("===========MartInterceptor에서 FilebackedMapList로 밀어넣고 있는 데이터===============");
            // Mart Data
            CloseableList<Map<String, Object>> rowData = new FileBackedMapList();
            while (rs.next()) {
            	Map<String, Object> row = new LinkedHashMap<>();
            	for (int i = 1; i <= columnCount; i++) {
            		DataField field =  new DataField(i, rsmd, rs.getObject(i));
            		row.put(rsmd.getColumnLabel(i), JavaxtUtils.getValue(field));
            	}
                if ("이재형".equals(row.get("MD명")) && "주식회사 가원".equals(row.get("업체명"))) {
                    logger.info(row.toString());
                }
            	rowData.add(row);
            }

            logger.info("===========최종적으로 FIleBackedMapList에 저장된 데이터===============");
        
            rowData.stream()
                .filter(item -> 
                    "이재형".equals(item.get("MD명")) && 
                    "주식회사 가원".equals(item.get("업체명"))
                )
                .forEach(item -> logger.info(item.toString()));
    
            logger.info("===========Mart Interceptor 끝!===============");
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
