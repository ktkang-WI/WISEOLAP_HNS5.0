package com.wise.MarketingPlatForm.log.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.log.vo.ExportLogDTO;
import com.wise.MarketingPlatForm.log.vo.LogParamVO;
import com.wise.MarketingPlatForm.log.vo.LoginLogDTO;
import com.wise.MarketingPlatForm.log.vo.QueryLogDTO;
import com.wise.MarketingPlatForm.log.vo.ReportHisEntity;
import com.wise.MarketingPlatForm.log.vo.ReportHisSummaryDTO;
import com.wise.MarketingPlatForm.log.vo.ReportLogDTO;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;

@Mapper
public interface LogDAO {

    List<ExportLogDTO> selectExportLog(LogParamVO logParamVO);

    List<ReportLogDTO> selectReportLog(LogParamVO logParamVO);

    List<QueryLogDTO> selectQueryLog(LogParamVO logParamVO);

    List<LoginLogDTO> selectLoginLog(LogParamVO logParamVO);

    void insertLoginLog(LoginLogDTO logDto);

    void insertReportLog(ReportLogDTO logDto);

    void insertExportLog(ExportLogDTO logDto);

    void insertQueryLog(QueryLogDTO logDto);

    void deleteReportHisByCount(ReportHisEntity entity);

    void insertReportHis(ReportHisEntity entity);

    List<ReportHisSummaryDTO> selectReportHisList(int reportId);

    ReportMstrEntity selectReportHis(String reportId, String reportSeq);

}