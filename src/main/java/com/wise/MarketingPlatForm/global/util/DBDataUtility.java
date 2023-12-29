package com.wise.MarketingPlatForm.global.util;

public class DBDataUtility {
	
	public static boolean parseBooleanByString (String YN) {
		if(YN.equals("Y")) {
			return true;
		} else {
			return false;
		}
	}
	
	public static String convertUpperSnakeToCamel(String upperSnakeCase) {
        StringBuilder camelCase = new StringBuilder();

        // 문자열을 '_'로 분리
        String[] parts = upperSnakeCase.split("_");

        // 첫 단어는 그대로 유지하고, 두 번째 단어부터 첫 글자를 대문자로 변환하여 합침
        for (int i = 0; i < parts.length; i++) {
            if (i == 0) {
                camelCase.append(parts[i].toLowerCase());
            } else {
                camelCase.append(Character.toUpperCase(parts[i].charAt(0)))
                          .append(parts[i].substring(1).toLowerCase());
            }
        }
        return camelCase.toString();
	}
}
