package com.wise.MarketingPlatForm.report.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
import com.wise.MarketingPlatForm.report.vo.FolderMasterVO;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;

@Mapper
public interface ReportDAO {
    public ReportMstrEntity selectReport(String reportId);
    public Map addReport(ReportMstrDTO reportMstrDTO);
    public List<FolderMasterVO> selectPublicReportFolderList(String userId);
    public List<FolderMasterVO> selectPrivateReportFolderList(String userId);
}