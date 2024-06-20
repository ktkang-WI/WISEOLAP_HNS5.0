package com.wise.MarketingPlatForm.log.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.log.vo.LogParamVO;
import com.wise.MarketingPlatForm.log.dao.LogDAO;
import com.wise.MarketingPlatForm.log.vo.ExportLogDTO;
import com.wise.MarketingPlatForm.log.vo.QueryLogDTO;
import com.wise.MarketingPlatForm.log.vo.ReportLogDTO;
import com.wise.MarketingPlatForm.log.vo.LoginLogDTO;

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
}
