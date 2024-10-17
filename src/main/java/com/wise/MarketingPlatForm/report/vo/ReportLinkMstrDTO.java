package com.wise.MarketingPlatForm.report.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import com.google.gson.Gson;
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
	String reportNm;
	String reportType;
	int linkReportId;
	String linkReportNm;
	String linkReportType;
	List<Object> linkParamInfo;
	List<Object> linkFkInfo;
	// @SerializedName("linkXmlParam")
	// String linkXml;

	public static ReportLinkMstrEntity toEntity(ReportLinkMstrDTO reportLinkMstrDTO) {
		Gson gson = new Gson();
		return ReportLinkMstrEntity.builder()
			.reportId(reportLinkMstrDTO.getReportId())
			.reportNm(reportLinkMstrDTO.getReportNm())
			.reportType(reportLinkMstrDTO.getReportType())
			.linkReportId(reportLinkMstrDTO.getLinkReportId())
			.linkReportNm(reportLinkMstrDTO.getLinkReportNm())
			.linkReportType(reportLinkMstrDTO.getLinkReportType())
			.linkParamInfo(gson.toJson(reportLinkMstrDTO.getLinkParamInfo()))
			.linkFkInfo(gson.toJson(reportLinkMstrDTO.getLinkFkInfo()))
			.build();
	}
}