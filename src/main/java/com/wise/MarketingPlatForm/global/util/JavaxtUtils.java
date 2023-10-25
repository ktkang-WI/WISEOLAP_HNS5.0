package com.wise.MarketingPlatForm.global.util;

import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javaxt.utils.Date;

@Component
public class JavaxtUtils {
	@Value("${wise.config.database-string-type}")
	private static List<String> databaseStringType;
	
	@Value("${wise.config.database-integer-type}")
	private static List<String> databaseIntegerType;
	
    public static Object getValue(javaxt.sql.Field field) {
    	Object value = null;
    	String type = field.getType();
    	try {
    		if (field.getValue().isNull()) {
    			for (String string : databaseStringType) {
    				if (type.equalsIgnoreCase(string)) {
    					value = "";
    					break;
    				}
    			}
    			if (value != null) return value;
    			
    			for (String integer : databaseIntegerType) {
    				if (type.equalsIgnoreCase(integer)) {
    					value = 0;
    					break;
    				}
    			}
    			if (value != null) return value;
    			
    			if (value == null) {
    				String message = "";
    				message += "found data type of [" + type + "] for null value";
    				message += ", add [" + type + "] type to web-application.xml";
    				throw new Exception(message);
    			}
    		}
    		else {
    			if ("datetime".equalsIgnoreCase(type) || "date".equalsIgnoreCase(type) ) {
    				Date date = field.getValue().toDate();
    				String dateStr = "";
    				dateStr += date.getYear() + ".";
    				dateStr += StringUtils.leftPad(String.valueOf(date.getMonth()), 2, "0") + ".";
    				dateStr += StringUtils.leftPad(String.valueOf(date.getDay()), 2, "0") + " ";
    				dateStr += StringUtils.leftPad(String.valueOf(date.getHour()), 2, "0") + ":";
    				dateStr += StringUtils.leftPad(String.valueOf(date.getMinute()), 2, "0") + ":";
    				dateStr += StringUtils.leftPad(String.valueOf(date.getSecond()), 2, "0");
    				
    				value = dateStr;
    			}
    			else {
    				value = field.getValue().toObject();
    			}
    		}
			
		} catch (Exception e) {
			// TODO: handle exception
		}
        
        
        return value;
    }
}
