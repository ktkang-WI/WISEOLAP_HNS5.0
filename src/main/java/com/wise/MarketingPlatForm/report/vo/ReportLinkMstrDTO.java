package com.wise.MarketingPlatForm.report.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import com.google.gson.annotations.SerializedName;
// import lombok.experimental.SuperBuilder;
import com.wise.MarketingPlatForm.report.entity.ReportLinkMstrEntity;

@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportLinkMstrDTO {
	int reportId;
	int linkReportId;
	@SerializedName("linkXmlParam")
	String linkXml;
	int linkReportOrdinal;
	String linkReportType;
	String dataLinkType;
	String linkReportNm;
	boolean subYn;
  List<ReportLinkSubMstrDTO> subLinkReport;

	public static ReportLinkMstrEntity toEntity(ReportLinkMstrDTO reportLinkMstrDTO) {
		return ReportLinkMstrEntity.builder()
			.reportId(reportLinkMstrDTO.getReportId())
			.linkReportId(reportLinkMstrDTO.getLinkReportId())
			.linkXml(reportLinkMstrDTO.getLinkXml())
			.linkReportOrdinal(reportLinkMstrDTO.getLinkReportOrdinal())
			.linkReportNm(reportLinkMstrDTO.getLinkReportNm())
			.linkReportType(reportLinkMstrDTO.getLinkReportType())
			.dataLinkType(reportLinkMstrDTO.getDataLinkType())
			.build();
	}
}