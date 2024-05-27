package com.wise.MarketingPlatForm.global.util;

import org.apache.commons.lang3.math.NumberUtils;

public final class WINumberUtils {
	
	private WINumberUtils() {
		
	}
	
	public static boolean isNumber(final String s) {
		return NumberUtils.isDigits(s) || NumberUtils.isParsable(s) || NumberUtils.isCreatable(s);
	}
}


