package com.wise.MarketingPlatForm.report.entity;

import java.util.List;

import com.google.gson.Gson;
import com.wise.MarketingPlatForm.report.vo.ReportLinkMstrDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportLinkMstrEntity {
	int reportId;
  String reportNm;
  String reportType;
	int linkReportId;
	String linkReportNm;
	String linkReportType;
	String linkParamInfo;
	String linkFkInfo;

  public static ReportLinkMstrDTO toDTO(ReportLinkMstrEntity reportLinkMstrEntity) {
    Gson gson = new Gson();

    return ReportLinkMstrDTO.builder()
      .reportId(reportLinkMstrEntity.getReportId())
      .reportNm(reportLinkMstrEntity.getReportNm())
      .reportType(reportLinkMstrEntity.getReportType())
      .linkReportId(reportLinkMstrEntity.getLinkReportId())
      .linkReportNm(reportLinkMstrEntity.getLinkReportNm())
      .linkReportType(reportLinkMstrEntity.getLinkReportType())
      .linkParamInfo(gson.fromJson(reportLinkMstrEntity.getLinkParamInfo(), List.class))
      .linkFkInfo(gson.fromJson(reportLinkMstrEntity.getLinkFkInfo(), List.class))
      .build();
  }
}
