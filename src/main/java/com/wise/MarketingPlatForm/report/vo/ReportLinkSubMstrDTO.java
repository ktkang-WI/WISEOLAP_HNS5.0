package com.wise.MarketingPlatForm.report.vo;

import com.google.gson.annotations.SerializedName;
import com.wise.MarketingPlatForm.report.entity.ReportLinkSubMstrEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportLinkSubMstrDTO {
  int reportId;
	int linkReportId;
  @SerializedName("subLinkItemId")
  String linkSubItem;
  @SerializedName("dataLinkType")
	String linkDataType;
  @SerializedName("subLinkXmlParam")
  String linkXmlParam;
  @SerializedName("subLinkXmlData")
  String linkXmlData;
	int linkReportOrdinal;
  @SerializedName("subLinkReportType")
	String linkReportType;
  String linkReportNm;

  public static ReportLinkSubMstrEntity toEntity(ReportLinkSubMstrDTO reportLinkSubMstrDTO) {
    return ReportLinkSubMstrEntity.builder()
      .reportId(reportLinkSubMstrDTO.getReportId())
      .linkReportId(reportLinkSubMstrDTO.getLinkReportId())
      .linkSubItem(reportLinkSubMstrDTO.getLinkSubItem())
      .linkDataType(reportLinkSubMstrDTO.getLinkDataType())
      .linkXmlParam(reportLinkSubMstrDTO.getLinkXmlParam())
      .linkXmlData(reportLinkSubMstrDTO.getLinkXmlData())
      .linkReportOrdinal(reportLinkSubMstrDTO.getLinkReportOrdinal())
      .linkReportType(reportLinkSubMstrDTO.getLinkReportType())
      .linkReportNm(reportLinkSubMstrDTO.getLinkReportNm())
      .build();
  }
}
