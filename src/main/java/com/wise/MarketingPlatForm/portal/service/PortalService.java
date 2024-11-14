package com.wise.MarketingPlatForm.portal.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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

    public List<Map<String, Object>> getAdminCardData(String date, String type, String team) {
        String moneyUnitStr = "백만원";
        int moneyUnit = 1_000_000;

        if (team.equals("전체")) {
            team = "MD_TEAM_NM";
        } else {
            team = "'" + team + "'";
        }
        if (type.equals("년누적")) {
            moneyUnitStr = "억원";
            moneyUnit = 100_000_000;
        }

        String dateFilter = "GATHER_BASE_DATE = '" + date + "'";

        if (type.equals("월누적")) {
            dateFilter = "GATHER_BASE_DATE BETWEEN SUBSTR('" + date + "',1,6)||'01' AND '" + date + "'";
        } else if(type.equals("년누적")) {
            dateFilter = "GATHER_BASE_DATE BETWEEN SUBSTR('" + date + "',1,4)||'0101' AND '" + date + "'";
        }

        String sql = "SELECT \n" +
                "      '예상취급액(" + moneyUnitStr + ")' AS \"구분\",\n" +
                "      ROUND(SUM(EXPC_HDAMT) / " + moneyUnit + ", 0) AS \"금액\",\n" +
                "      CASE WHEN SUM(PVMN_EXPC_HDAMT) = 0 THEN NULL \n" +
                "           ELSE TO_CHAR(SUM(EXPC_HDAMT) / SUM(PVMN_EXPC_HDAMT) * 100, 'FM9990.0') || '%%' END AS \"전월비\",\n"
                +
                "      CASE WHEN SUM(EXPC_GOAL_HDAMT) = 0 THEN NULL \n" +
                "           ELSE TO_CHAR(SUM(EXPC_HDAMT) / SUM(EXPC_GOAL_HDAMT) * 100, 'FM9990.0') || '%%' END AS \"계획비\"\n"
                +
                "FROM MISDM.MAIN_EXPC_RLZ_CTTN_GATHER\n" +
                "WHERE " +
                dateFilter + "\n" +
                "  AND MD_TEAM_NM = " + team + "       -- @MDTEAM\n" +
                "\n" +
                "UNION ALL\n" +
                "\n" +
                "SELECT \n" +
                "      '실현취급액(" + moneyUnitStr + ")' AS \"구분\",\n" +
                "      ROUND(SUM(RLZ_HDAMT) / " + moneyUnit + ", 0) AS \"금액\",\n" +
                "      CASE WHEN SUM(PVMN_RLZ_HDAMT) = 0 THEN NULL \n" +
                "           ELSE TO_CHAR(SUM(RLZ_HDAMT) / SUM(PVMN_RLZ_HDAMT) * 100, 'FM9990.0') || '%%' END AS \"전월비\",\n"
                +
                "      CASE WHEN SUM(RLZ_GOAL_HDAMT) = 0 THEN NULL \n" +
                "           ELSE TO_CHAR(SUM(RLZ_HDAMT) / SUM(RLZ_GOAL_HDAMT) * 100, 'FM9990.0') || '%%' END AS \"계획비\"\n"
                +
                "FROM MISDM.MAIN_EXPC_RLZ_CTTN_GATHER\n" +
                "WHERE " +
                dateFilter + "\n" +
                "  AND MD_TEAM_NM = " + team + "       -- @MDTEAM\n" +
                "HAVING SUM(RLZ_HDAMT) > 0           \n" +
                "\n" +
                "UNION ALL\n" +
                "\n" +
                "SELECT \n" +
                "      '실현공헌이익(" + moneyUnitStr + ")' AS \"구분\",\n" +
                "      ROUND(SUM(RLZ_CTTN_PFT) / " + moneyUnit + ", 0) AS \"금액\",\n" +
                "      CASE WHEN SUM(PVMN_RLZ_CTTN_PFT) = 0 THEN NULL \n" +
                "           ELSE TO_CHAR(SUM(RLZ_CTTN_PFT) / SUM(PVMN_RLZ_CTTN_PFT) * 100, 'FM9990.0') || '%%' END AS \"전월비\",\n"
                +
                "      CASE WHEN SUM(RLZ_GOAL_CTTN_PFT) = 0 THEN NULL \n" +
                "           ELSE TO_CHAR(SUM(RLZ_CTTN_PFT) / SUM(RLZ_GOAL_CTTN_PFT) * 100, 'FM9990.0') || '%%' END AS \"계획비\"\n"
                +
                "FROM MISDM.MAIN_EXPC_RLZ_CTTN_GATHER\n" +
                "WHERE " +
                dateFilter + "\n" +
                "  AND MD_TEAM_NM = " + team + "       -- @MDTEAM";

        MartResultDTO martResultDTO = null;

        martResultDTO = martDAO.select(3465, sql);

        return martResultDTO.getRowData();
    }

    public List<Map<String, Object>> getCardData(String date, String type) {
        String moneyUnitStr = "백만원";
        String humanUnitStr = "명";
        int moneyUnit = 1_000_000;
        int humanUnit = 1;
        if (type.equals("조회일")) {
            type = "";
        } else {
            type = "_" + type;
        }

        if (type.equals("_년누적")) {
            moneyUnitStr = "억원";
            humanUnitStr = "천명";
            moneyUnit = 100_000_000;
            humanUnit = 1_000;
        } else if (type.equals("_월누적")) {
            humanUnitStr = "백명";
            humanUnit = 100;
        }

        // 월누적, 년누적
        String sql = String.format(
                "-- 카드_01.예상취급액\n" +
                        "SELECT /*+ RESULT_CACHES */ \n" +
                        "    '예상취급액(" + moneyUnitStr + ")' AS \"구분\",\n" +
                        "    MAIN_SCRN_GATHER_DATE AS \"일자\",\n" +
                        "    ROUND(MAIN_SCRN_AMT_2/" + moneyUnit + ",0) AS \"금액\",\n" +
                        "    CASE WHEN MAIN_SCRN_AMT_1 = 0 THEN 0 || '%%'\n" +
                        "    ELSE TO_CHAR(ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_1)*100 - 100,1), 'FM9990.0')||'%%'\n" +
                        "    END \"전년비\",\n" +
                        "    CASE WHEN MAIN_SCRN_AMT_3 = 0 THEN 0 || '%%'\n" +
                        "    ELSE TO_CHAR(ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_3)*100,1), 'FM9990.0')||'%%'\n" +
                        "    END \"계획비\"\n" +
                        // " ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_1)*100,1)||'%%' AS \"전년비\",\n" + //
                        // %%는 %를 나타냄
                        // " ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_3)*100,1)||'%%' AS \"계획비\"\n" +
                        "FROM MISDM.DM_F_MAIN_SCRN_DAIL_GATHER\n" +
                        "WHERE MAIN_SCRN_TIT = '카드_01.예상취급액" + type + "'\n" +
                        "  AND MAIN_SCRN_GATHER_DATE = '%s'\n" + // %s는 String 변수가 들어갈 위치
                        "\n" +
                        "UNION ALL\n" +
                        "\n" +
                        "-- 카드_02.실현취급액\n" +
                        "SELECT /*+ RESULT_CACHES */ \n" +
                        "    '실현취급액(" + moneyUnitStr + ")' AS \"구분\",\n" +
                        "    MAIN_SCRN_GATHER_DATE AS \"일자\",\n" +
                        "    ROUND(MAIN_SCRN_AMT_2/" + moneyUnit + ",0) AS \"금액\",\n" +
                        "    CASE WHEN MAIN_SCRN_AMT_1 = 0 THEN 0 || '%%'\n" +
                        "    ELSE TO_CHAR(ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_1)*100 - 100,1), 'FM9990.0')||'%%'\n" +
                        "    END \"전년비\",\n" +
                        "    CASE WHEN MAIN_SCRN_AMT_3 = 0 THEN 0 || '%%'\n" +
                        "    ELSE TO_CHAR(ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_3)*100,1), 'FM9990.0')||'%%'\n" +
                        "    END \"계획비\"\n" +
                        "FROM MISDM.DM_F_MAIN_SCRN_DAIL_GATHER\n" +
                        "WHERE MAIN_SCRN_TIT = '카드_02.실현취급액" + type + "'\n" +
                        "  AND MAIN_SCRN_GATHER_DATE = '%s'\n" +
                        "\n" +
                        "UNION ALL\n" +
                        "\n" +
                        "-- 카드_03.실현공헌이익\n" +
                        "SELECT /*+ RESULT_CACHES */ \n" +
                        "    '실현공헌이익(" + moneyUnitStr + ")' AS \"구분\",\n" +
                        "    MAIN_SCRN_GATHER_DATE AS \"일자\",\n" +
                        "    ROUND(MAIN_SCRN_AMT_2/" + moneyUnit + ",0) AS \"금액\",\n" +
                        "    CASE WHEN MAIN_SCRN_AMT_1 = 0 THEN 0 || '%%'\n" +
                        "    ELSE TO_CHAR(ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_1)*100 - 100,1), 'FM9990.0')||'%%'\n" +
                        "    END \"전년비\",\n" +
                        "    CASE WHEN MAIN_SCRN_AMT_3 = 0 THEN 0 || '%%'\n" +
                        "    ELSE TO_CHAR(ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_3)*100,1), 'FM9990.0')||'%%'\n" +
                        "    END \"계획비\"\n" +
                        // " ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_1)*100,1)||'%%' AS \"전년비\",\n" +
                        // " ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_3)*100,1)||'%%' AS \"계획비\"\n" +
                        "FROM MISDM.DM_F_MAIN_SCRN_DAIL_GATHER\n" +
                        "WHERE MAIN_SCRN_TIT = '카드_03.실현공헌이익" + type + "'\n" +
                        "  AND MAIN_SCRN_GATHER_DATE = '%s'\n" +
                        "\n" +
                        "UNION ALL\n" +
                        "\n" +
                        "-- 카드_04.주문고객수\n" +
                        "SELECT /*+ RESULT_CACHES */ \n" +
                        "    '주문고객수(" + humanUnitStr + ")' AS \"구분\",\n" +
                        "    MAIN_SCRN_GATHER_DATE AS \"일자\",\n" +
                        "    ROUND(MAIN_SCRN_AMT_2/" + humanUnit + ",0) AS \"금액\",\n" +
                        "    CASE WHEN MAIN_SCRN_AMT_1 = 0 THEN 0 || '%%'\n" +
                        "    ELSE TO_CHAR(ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_1)*100 - 100,1), 'FM9990.0')||'%%'\n" +
                        "    END \"전년비\",\n" +
                        // " ROUND((MAIN_SCRN_AMT_2/MAIN_SCRN_AMT_1)*100,1)||'%%' AS \"전년비\",\n" +
                        "    '' AS \"계획비\"  -- 해당 데이터가 없으므로 빈 칸 처리\n" +
                        "FROM MISDM.DM_F_MAIN_SCRN_DAIL_GATHER\n" +
                        "WHERE MAIN_SCRN_TIT = '카드_04.주문고객수" + type + "'\n" +
                        "  AND MAIN_SCRN_GATHER_DATE = '%s'\n",
                date, date, date, date);

        MartResultDTO martResultDTO = null;

        martResultDTO = martDAO.select(3465, sql);

        return martResultDTO.getRowData();
    }

    public String getMaxDate() {
        String sql = "SELECT IN_DATA_DT FROM MISDM.VW_DM_F_MAIN_SCRN_DAIL_GATHER_ISDT";

        MartResultDTO martResultDTO = null;

        try {
            martResultDTO = martDAO.select(3465, sql);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (martResultDTO == null || martResultDTO.getRowData().size() == 0) {
            LocalDate currentDate = LocalDate.now();

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
            return currentDate.minusDays(1).format(formatter);
        } else {
            return martResultDTO.getRowData().get(0).get("IN_DATA_DT").toString();
        }
    }

    public List<Map<String, Object>> getTeamList(String date) {
        String sql = "SELECT MD_TEAM_NM\r\n" +
                        "\tFROM MISDM.VW_MAIN_IM_TEAM_FILTER\r\n" +
                        "\tWHERE GATHER_BASE_DATE = '" + date + "'" +
                        "\tORDER BY MD_TEAM_ORD";

        MartResultDTO martResultDTO = null;

        martResultDTO = martDAO.select(3465, sql);

        return martResultDTO.getRowData();
    }
}
