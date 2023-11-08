package com.wise.MarketingPlatForm.report.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.report.entity.ReportListEntity;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;

@Mapper
public interface ReportDAO {
    public ReportMstrEntity selectReport(String reportId);
    public List<ReportListEntity> selectPublicReportList(String userId, List<String> reportTypes, String editMode);
    public List<ReportListEntity> selectPrivateReportList(String userId, List<String> reportTypes, String editMode);
}