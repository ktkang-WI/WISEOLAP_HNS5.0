package com.wise.MarketingPlatForm.portal.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.mart.dao.MartDAO;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;

@Service
public class PortalService {

    private final MartDAO martDAO;

    PortalService(MartDAO martDAO) {
        this.martDAO = martDAO;
    }

    public List<Map<String, Object>> getCardData(String date, String type) {
        if (type.equals("조회일")) {
            type = "";
        } else {
            type = "_" + type;
        }

        // 월누적, 년누적
        String sql = String.format(
            "-- 카드_01.예상취급액\n" +
            "SELECT \n" +
            "    '예상취급액(백만원)' AS \"구분\",\n" +
            "    MAIN_SCRN_GATHER_DATE AS \"일자\",\n" +
            "    ROUND(MAIN_SCRN_AMT_2/1000000,0) AS \"금액\",\n" +
            "    CASE WHEN MAIN_SCRN_AMT_1 = 0 THEN 0 || '%%'\n" +
            "    ELSE ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_1)*100,1)||'%%'\n" +
            "    END \"전년비\",\n" +
            "    CASE WHEN MAIN_SCRN_AMT_3 = 0 THEN 0 || '%%'\n" +
            "    ELSE ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_3)*100,1)||'%%'\n" +
            "    END \"계획비\"\n" +
            //"    ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_1)*100,1)||'%%' AS \"전년비\",\n" +  // %%는 %를 나타냄
            //"    ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_3)*100,1)||'%%' AS \"계획비\"\n" +
            "FROM MISDM.DM_F_MAIN_SCRN_DAIL_GATHER\n" +
            "WHERE MAIN_SCRN_TIT = '카드_01.예상취급액" + type+ "'\n" +
            "  AND MAIN_SCRN_GATHER_DATE = '%s'\n" +  // %s는 String 변수가 들어갈 위치
            "\n" +
            "UNION ALL\n" +
            "\n" +
            "-- 카드_02.실현취급액\n" +
            "SELECT \n" +
            "    '실현취급액(백만원)' AS \"구분\",\n" +
            "    MAIN_SCRN_GATHER_DATE AS \"일자\",\n" +
            "    ROUND(MAIN_SCRN_AMT_2/1000000,0) AS \"금액\",\n" +
            "    CASE WHEN MAIN_SCRN_AMT_1 = 0 THEN 0 || '%%'\n" +
            "    ELSE ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_1)*100,1)||'%%'\n" +
            "    END \"전년비\",\n" +
            "    CASE WHEN MAIN_SCRN_AMT_3 = 0 THEN 0 || '%%'\n" +
            "    ELSE ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_3)*100,1)||'%%'\n" +
            "    END \"계획비\"\n" +
            "FROM MISDM.DM_F_MAIN_SCRN_DAIL_GATHER\n" +
            "WHERE MAIN_SCRN_TIT = '카드_02.실현취급액" + type+ "'\n" +
            "  AND MAIN_SCRN_GATHER_DATE = '%s'\n" +
            "\n" +
            "UNION ALL\n" +
            "\n" +
            "-- 카드_03.실현공헌이익\n" +
            "SELECT \n" +
            "    '실현공헌이익(백만원)' AS \"구분\",\n" +
            "    MAIN_SCRN_GATHER_DATE AS \"일자\",\n" +
            "    ROUND(MAIN_SCRN_AMT_2/1000000,0) AS \"금액\",\n" +
            "    CASE WHEN MAIN_SCRN_AMT_1 = 0 THEN 0 || '%%'\n" +
            "    ELSE ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_1)*100,1)||'%%'\n" +
            "    END \"전년비\",\n" +
            "    CASE WHEN MAIN_SCRN_AMT_3 = 0 THEN 0 || '%%'\n" +
            "    ELSE ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_3)*100,1)||'%%'\n" +
            "    END \"계획비\"\n" +
            // "    ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_1)*100,1)||'%%' AS \"전년비\",\n" +
            // "    ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_3)*100,1)||'%%' AS \"계획비\"\n" +
            "FROM MISDM.DM_F_MAIN_SCRN_DAIL_GATHER\n" +
            "WHERE MAIN_SCRN_TIT = '카드_03.실현공헌이익" + type+ "'\n" +
            "  AND MAIN_SCRN_GATHER_DATE = '%s'\n" +
            "\n" +
            "UNION ALL\n" +
            "\n" +
            "-- 카드_04.주문고객수\n" +
            "SELECT \n" +
            "    '주문고객수(명)' AS \"구분\",\n" +
            "    MAIN_SCRN_GATHER_DATE AS \"일자\",\n" +
            "    ROUND(MAIN_SCRN_AMT_2,0) AS \"금액\",  -- 금액 대신 '명'이지만 일관성 유지\n" +
            "    CASE WHEN MAIN_SCRN_AMT_1 = 0 THEN 0 || '%%'\n" +
            "    ELSE ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_1)*100,1)||'%%'\n" +
            "    END \"전년비\",\n" +
            // "    ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_1)*100,1)||'%%' AS \"전년비\",\n" +
            "    '' AS \"계획비\"  -- 해당 데이터가 없으므로 빈 칸 처리\n" +
            "FROM MISDM.DM_F_MAIN_SCRN_DAIL_GATHER\n" +
            "WHERE MAIN_SCRN_TIT = '카드_04.주문고객수" + type+ "'\n" +
            "  AND MAIN_SCRN_GATHER_DATE = '%s'\n", date, date, date, date);

        MartResultDTO martResultDTO = null;
        System.out.println(sql);

        martResultDTO = martDAO.select(3465, sql);
        
        return martResultDTO.getRowData();
    }

}
