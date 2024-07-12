package com.wise.MarketingPlatForm.log.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.log.vo.LogParamVO;
import com.wise.MarketingPlatForm.log.dao.LogDAO;
import com.wise.MarketingPlatForm.log.vo.ExportLogDTO;
import com.wise.MarketingPlatForm.log.vo.QueryLogDTO;
import com.wise.MarketingPlatForm.log.vo.ReportLogDTO;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;
import com.wise.MarketingPlatForm.log.vo.LoginLogDTO;
import com.wise.MarketingPlatForm.log.vo.ReportHisEntity;
import com.wise.MarketingPlatForm.log.vo.ReportHisSummaryDTO;

@Service
public class LogService {

    LogDAO logDAO;

    LogService (LogDAO logDAO) {
        this.logDAO = logDAO;
    }
    
    public List<ExportLogDTO> getExportLog(LogParamVO logParamVO) {
        return logDAO.selectExportLog(logParamVO);
    }

    public List<ReportLogDTO> getReportLog(LogParamVO logParamVO) {
        return logDAO.selectReportLog(logParamVO);
    }

    public List<QueryLogDTO> getQueryLog(LogParamVO logParamVO) {
        return logDAO.selectQueryLog(logParamVO);
    }

    public List<LoginLogDTO> getLoginLog(LogParamVO logParamVO) {
        return logDAO.selectLoginLog(logParamVO);
    }

    public List<ReportHisSummaryDTO> getReportHistory(int reportId) {
        return logDAO.selectReportHisList(reportId);
    }

    public void insertExportLog(ExportLogDTO logDto) {
        logDAO.insertExportLog(logDto);
    }

    public void insertReportLog(ReportLogDTO logDto) {
        logDAO.insertReportLog(logDto);
    }

    public void insertLoginLog(LoginLogDTO logDto) {
        logDAO.insertLoginLog(logDto);
    }

    public void insertQueryLog(QueryLogDTO logDto) {
        logDAO.insertQueryLog(logDto);
    }

    public void insertReportHis(ReportMstrDTO reportMstrDTO) {
        ReportHisEntity entity = ReportHisEntity.builder()
            .reportId(reportMstrDTO.getReportId())
            .reportNm(reportMstrDTO.getReportNm())
            .reportSubTitle(reportMstrDTO.getReportSubTitle())
            .fldId(reportMstrDTO.getFldId())
            .fldType(reportMstrDTO.getFldType())
            .reportOrdinal(reportMstrDTO.getReportOrdinal())
            .reportType(reportMstrDTO.getReportType().toString())
            .reportDesc(reportMstrDTO.getReportDesc())
            .reportTag(reportMstrDTO.getReportTag())
            .paramXml(reportMstrDTO.getParamXml())
            .modUserNo(reportMstrDTO.getRegUserNo() == 0 ?
                reportMstrDTO.getModUserNo() : reportMstrDTO.getRegUserNo())
            .chartXml(reportMstrDTO.getChartXml())
            .layoutXml(reportMstrDTO.getLayoutXml())
            .reportXml(reportMstrDTO.getReportXml())
            .datasetXml(reportMstrDTO.getDatasetXml())
            .build();

        // NOTE: 개수 제한 두고 싶을 때 활성화
        // logDAO.deleteReportHisByCount(entity);
        logDAO.insertReportHis(entity);
    }

    public ReportMstrEntity selectReportHis(String reportId, String reportSeq) {
        return logDAO.selectReportHis(reportId, reportSeq);
    }
}
