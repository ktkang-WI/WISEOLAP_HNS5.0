package com.wise.MarketingPlatForm.report.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
import com.wise.MarketingPlatForm.report.vo.FolderMasterVO;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;

@Mapper
public interface ReportDAO {
    public ReportMstrEntity selectReport(String reportId);
    public int addReport(ReportMstrDTO reportMstrDTO);
    public int deleteReport(int reportId);
    public List<ReportMstrEntity> checkDuplicatedReport(ReportMstrDTO reportMstrDTO);
    public List<FolderMasterVO> selectPublicReportFolderList(String userId);
    public List<FolderMasterVO> selectPrivateReportFolderList(String userId);
}