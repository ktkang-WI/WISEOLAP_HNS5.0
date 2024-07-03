package com.wise.MarketingPlatForm.report.dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.dataset.domain.cube.vo.DetailedDataItemVO;
import com.wise.MarketingPlatForm.dataset.entity.UserUploadMstrEntity;
import com.wise.MarketingPlatForm.report.entity.DwReportChkEntity;
import com.wise.MarketingPlatForm.report.entity.ReportLinkMstrEntity;
import com.wise.MarketingPlatForm.report.entity.ReportLinkSubMstrEntity;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
import com.wise.MarketingPlatForm.report.vo.ReportListDTO;
import com.wise.MarketingPlatForm.report.vo.FolderMasterVO;

@Mapper
public interface ReportDAO {
    public boolean insertLinkReport(ReportLinkMstrEntity reportLinkMstrEntity); 
    public boolean insertSubLinkReport(ReportLinkSubMstrEntity reportLinkSubMstrEntity);
    public ReportMstrEntity selectReport(String reportId);
    public List<ReportListDTO> selectPublicReportList(String userId, List<String> reportTypes, String editMode);
    public List<ReportListDTO> publicReportList();
    public List<ReportListDTO> selectPrivateReportList(String userId, List<String> reportTypes, String editMode);
    public List<ReportListDTO> privateReportList();
    public boolean updateReport(ReportMstrEntity reportMstrEntity);
    public boolean insertReport(ReportMstrEntity reportMstrEntity);
    public boolean updateConfigReport(ReportMstrEntity reportMstrEntity);
    public boolean deleteReport(int reportId);
    public List<ReportMstrEntity> checkDuplicatedReport(ReportMstrEntity reportMstrDTO);
    public ReportMstrEntity selectLinkReportParam(String reportId);
    public List<ReportLinkMstrEntity> selectLinkReportList(String reportId);
    public List<ReportLinkSubMstrEntity> selectSubLinkReportList(String reportId);
    public List<FolderMasterVO> selectPublicReportFolderList(String userId);
    public List<FolderMasterVO> selectPrivateReportFolderList(String userId);
    public List<DetailedDataItemVO> selectDetailedDataItem(String cubeId, String actId);
    public void insertUserUpload(UserUploadMstrEntity userUploadTable);
    public String selectReportName(String reportId);
    public List<DwReportChkEntity> selectDwReportChk(String reportId);
}