package com.wise.MarketingPlatForm.report.entity;

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
	int linkReportId;
	String linkXml;
	int linkReportOrdinal;
  String linkReportNm;
	String linkReportType;
	String dataLinkType;

  public static ReportLinkMstrDTO toDTO(ReportLinkMstrEntity reportLinkMstrEntity) {
    return ReportLinkMstrDTO.builder()
      .reportId(reportLinkMstrEntity.getReportId())
      .linkReportId(reportLinkMstrEntity.getLinkReportId())
      .linkXml(reportLinkMstrEntity.getLinkXml())
      .linkReportOrdinal(reportLinkMstrEntity.getLinkReportOrdinal())
      .linkReportNm(reportLinkMstrEntity.getLinkReportNm())
      .linkReportType(reportLinkMstrEntity.getLinkReportType())
      .dataLinkType(reportLinkMstrEntity.getDataLinkType())
      .build();
  }
}
