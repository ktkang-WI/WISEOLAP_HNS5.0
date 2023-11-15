package com.wise.MarketingPlatForm.report.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
import com.wise.MarketingPlatForm.report.vo.ReportListDTO;

@Mapper
public interface ReportDAO {
    public ReportMstrEntity selectReport(String reportId);
    public List<ReportListDTO> selectPublicReportList(String userId, List<String> reportTypes, String editMode);
    public List<ReportListDTO> selectPrivateReportList(String userId, List<String> reportTypes, String editMode);
}