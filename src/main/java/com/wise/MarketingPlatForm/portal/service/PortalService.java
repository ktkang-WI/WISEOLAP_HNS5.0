package com.wise.MarketingPlatForm.portal.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.global.config.MartConfig;
import com.wise.MarketingPlatForm.mart.dao.MartDAO;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.mart.vo.PortalCardQueryMstrVO;
import com.wise.MarketingPlatForm.mart.vo.PortalDataDTO;
import com.wise.MarketingPlatForm.mart.vo.PortalFilterDTO;
import com.wise.MarketingPlatForm.mart.vo.PortalReportMstrVO;
import com.wise.MarketingPlatForm.mart.vo.PortalTypeMstrVO;
import com.wise.MarketingPlatForm.portal.dao.PortalDAO;

@Service
@Transactional
public class PortalService {

    private final MartDAO martDAO;
    private final PortalDAO portalDAO;
    private final DatasetService datasetService;
    private final MartConfig martConfig;

    PortalService(
            MartDAO martDAO, PortalDAO portalDAO, MartConfig martConfig, DatasetService datasetService) {
        this.martDAO = martDAO;
        this.portalDAO = portalDAO;
        this.martConfig = martConfig;
        this.datasetService = datasetService;
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
        } else if (type.equals("년누적")) {
            dateFilter = "GATHER_BASE_DATE BETWEEN SUBSTR('" + date + "',1,4)||'0101' AND '" + date + "'";
        }

        String sql = "SELECT \n" +
                "      '예상취급액(" + moneyUnitStr + ")' AS \"구분\",\n" +
                "      ROUND(SUM(EXPC_HDAMT) / " + moneyUnit + ", 0) AS \"금액\",\n" +
                "      CASE WHEN SUM(PVMN_EXPC_HDAMT) = 0 THEN NULL \n" +
                "           ELSE TO_CHAR(SUM(EXPC_HDAMT) / SUM(PVMN_EXPC_HDAMT) * 100, 'FM999990.0') || '%' END AS \"전월비\",\n"
                +
                "      CASE WHEN SUM(EXPC_GOAL_HDAMT) = 0 THEN NULL \n" +
                "           ELSE TO_CHAR(SUM(EXPC_HDAMT) / SUM(EXPC_GOAL_HDAMT) * 100, 'FM999990.0') || '%' END AS \"계획비\"\n"
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
                "           ELSE TO_CHAR(SUM(RLZ_HDAMT) / SUM(PVMN_RLZ_HDAMT) * 100, 'FM999990.0') || '%' END AS \"전월비\",\n"
                +
                "      CASE WHEN SUM(RLZ_GOAL_HDAMT) = 0 THEN NULL \n" +
                "           ELSE TO_CHAR(SUM(RLZ_HDAMT) / SUM(RLZ_GOAL_HDAMT) * 100, 'FM999990.0') || '%' END AS \"계획비\"\n"
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
                "           ELSE TO_CHAR(SUM(RLZ_CTTN_PFT) / SUM(PVMN_RLZ_CTTN_PFT) * 100, 'FM999990.0') || '%' END AS \"전월비\",\n"
                +
                "      CASE WHEN SUM(RLZ_GOAL_CTTN_PFT) = 0 THEN NULL \n" +
                "           ELSE TO_CHAR(SUM(RLZ_CTTN_PFT) / SUM(RLZ_GOAL_CTTN_PFT) * 100, 'FM999990.0') || '%' END AS \"계획비\"\n"
                +
                "FROM MISDM.MAIN_EXPC_RLZ_CTTN_GATHER\n" +
                "WHERE " +
                dateFilter + "\n" +
                "  AND MD_TEAM_NM = " + team + "       -- @MDTEAM";

        MartResultDTO martResultDTO = null;

        martResultDTO = martDAO.select(3465, sql);

        return martResultDTO.getRowData();
    }

    public List<Map<String, Object>> getCardData(PortalFilterDTO filter) {
        PortalCardQueryMstrVO queryVO = portalDAO.selectPortalCardQueryMstr(filter);

        String query = queryVO.getQuery();
        String team = filter.getTeam();
        String date = "'" + filter.getDate() + "'";

        if (team == null || team.equals("") || team.equals("전체")) {
            team = "MD_TEAM_NM";
        } else {
            team = "'" + team + "'";
        }

        query = query.replaceAll("@MDTEAM", team).replaceAll("@DATE", date);

        MartResultDTO martResultDTO = null;

        DsMstrDTO dsMstrDTO = datasetService.getDataSource(queryVO.getDsId());
        martConfig.setMartDataSource(dsMstrDTO);

        martResultDTO = martDAO.select(queryVO.getDsId(), query);

        return martResultDTO.getRowData();
    }

    public String getMaxDate() {
        String sql = "SELECT IN_DATA_DT FROM MISDM.VW_DM_F_MAIN_SCRN_DAIL_GATHER_ISDT";

        MartResultDTO martResultDTO = null;

        try {
            DsMstrDTO dsMstrDTO = datasetService.getDataSource(3465);
            martConfig.setMartDataSource(dsMstrDTO);

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
                "\tAND MD_TEAM_NM NOT IN('비매핑')" +
                "\tORDER BY MD_TEAM_ORD";

        MartResultDTO martResultDTO = null;

        DsMstrDTO dsMstrDTO = datasetService.getDataSource(3465);
        martConfig.setMartDataSource(dsMstrDTO);

        martResultDTO = martDAO.select(3465, sql);

        return martResultDTO.getRowData();
    }

    public Map<String, Object> getPortalInfo(String auth) {
        Map<String, Object> result = new HashMap<>();

        List<PortalTypeMstrVO> portalTypes = portalDAO.selectPortalTypeMstr(auth);
        List<PortalReportMstrVO> portalReports = portalDAO.selectPortalReportMstr(auth);

        result.put("types", portalTypes);
        result.put("reports", portalReports);

        return result;
    }

    public PortalDataDTO getPortalConfig() {

        List<PortalTypeMstrVO> portalTypes = portalDAO.selectAllPortalTypeMstr();
        List<PortalReportMstrVO> portalReports = portalDAO.selectAllPortalReportMstr();
        List<PortalCardQueryMstrVO> portalQueries = portalDAO.selectAllPortalCardQueryMstr();

        PortalDataDTO result = new PortalDataDTO(portalTypes, portalReports, portalQueries);

        return result;
    }

    public void setPortalConfig(PortalDataDTO portalDataDTO) {
        portalDAO.deleteAllPortalCardQueryMstr();
        portalDAO.deleteAllPortalTypeMstr();
        portalDAO.deleteAllPortalReportMstr();

        portalDAO.insertPortalCardQueryMstr(portalDataDTO.getQueries());
        portalDAO.insertPortalTypeMstr(portalDataDTO.getTypes());
        portalDAO.insertPortalReportMstr(portalDataDTO.getReports());
    }
}
