package com.wise.MarketingPlatForm.report.entity;

import com.wise.MarketingPlatForm.report.vo.ReportLinkSubMstrDTO;
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
public class ReportLinkSubMstrEntity {
  int reportId;
	int linkReportId;
  String linkSubItem;
	String linkDataType;
  String linkXmlParam;
  String linkXmlData;
	int linkReportOrdinal;
	String linkReportType;
  String linkReportNm;

  public static ReportLinkSubMstrDTO toDTO(ReportLinkSubMstrEntity reportLinkSubMstrEntity) {
    return ReportLinkSubMstrDTO.builder()
      .reportId(reportLinkSubMstrEntity.getReportId())
      .linkReportId(reportLinkSubMstrEntity.getLinkReportId())
      .linkSubItem(reportLinkSubMstrEntity.getLinkSubItem())
      .linkDataType(reportLinkSubMstrEntity.getLinkDataType())
      .linkXmlParam(reportLinkSubMstrEntity.getLinkXmlParam())
      .linkXmlData(reportLinkSubMstrEntity.getLinkXmlData())
      .linkReportOrdinal(reportLinkSubMstrEntity.getLinkReportOrdinal())
      .linkReportType(reportLinkSubMstrEntity.getLinkReportType())
      .linkReportNm(reportLinkSubMstrEntity.getLinkReportNm())
      .build();
  }
}
