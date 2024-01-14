package com.wise.MarketingPlatForm.report.dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
import com.wise.MarketingPlatForm.report.vo.ReportListDTO;
import com.wise.MarketingPlatForm.report.vo.FolderMasterVO;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;

@Mapper
public interface ReportDAO {
    public ReportMstrEntity selectReport(String reportId);
    public List<ReportListDTO> selectPublicReportList(String userId, List<String> reportTypes, String editMode);
    public List<ReportListDTO> selectPrivateReportList(String userId, List<String> reportTypes, String editMode);
    public int addReport(ReportMstrEntity reportMstrEntity);
    public int deleteReport(int reportId);
    public List<ReportMstrEntity> checkDuplicatedReport(ReportMstrEntity reportMstrDTO);
    public List<FolderMasterVO> selectPublicReportFolderList(String userId);
    public List<FolderMasterVO> selectPrivateReportFolderList(String userId);
}