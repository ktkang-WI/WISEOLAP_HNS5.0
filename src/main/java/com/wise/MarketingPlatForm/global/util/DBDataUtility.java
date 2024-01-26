package com.wise.MarketingPlatForm.global.util;

public class DBDataUtility {
	
	public static boolean parseBooleanByString (String YN) {
		if(YN.equals("Y")) {
			return true;
		} else {
			return false;
		}
	} 
}
