package com.wise.MarketingPlatForm.global.util;

public final class StringCompareUtils {
	private StringCompareUtils(){
		
	}
	
    private static final int UNICODE_CHAR_MIN = Integer.parseInt("AC00", 16);

    private static final int UNICODE_CHAR_MAX = Integer.parseInt("D7A3", 16);
	
	public static int compare(String strA, String strB) {
		
		int result = 0;
		
		int minLen = Math.min(strA.length(), strB.length());

        for (int i = 0; i < minLen; i++) {
            char charA = strA.charAt(i);
            char charB = strB.charAt(i);

            if (charA == charB) {
                continue;
            }

            // 언어 우선순위 설정
            int languageOrderA = getLanguageOrder(charA);
            int languageOrderB = getLanguageOrder(charB);
            // 언어가 똑같을 경우
            if (languageOrderA == languageOrderB) {
                if (charA > charB) {
                    result = 1;
                }
                else {
                    result = -1;
                }
            }
            else {
                // 언어가 서로 다를 경우
                if (languageOrderA > languageOrderB) {
                    result = 1;
                }
                else {
                    result = -1;
                }
            }
            break;
        }
        
        if(result == 0 && strA.length() != strB.length()) {
        	if (strA.length() > strB.length()) {
                result = 1;
            }
            else {
                result = -1;
            }
        }
        
        return result;
	}
	

    private static int getLanguageOrder(char ch) {
        if (ch >= UNICODE_CHAR_MIN && ch <= UNICODE_CHAR_MAX) {
            return 1;
        }
        else if ((ch >= (int) 'A' && ch <= (int) 'Z') || (ch >= (int) 'a' && ch <= (int) 'z')) {
            return 2;
        }

        return 3;
    }
}

