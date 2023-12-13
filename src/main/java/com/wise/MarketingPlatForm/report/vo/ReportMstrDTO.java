package com.wise.MarketingPlatForm.report.vo;

import java.sql.Date;
import java.util.Base64;
import java.util.Optional;

import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
import com.wise.MarketingPlatForm.report.type.ReportType;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
@Setter
public class ReportMstrDTO {
    int reportId;
    String reportNm;
    int fldId;
    String fldType;
    String fldName;
    int reportOrdinal;
    ReportType reportType;
    String reportTag;
    String reportDesc;
    String reportLayout;
    String gridInfo;
    int datasrcId;
    String datasrcType;
    String datasetType;
    String reportXml;
    String chartXml;
    String layoutXml;
    String datasetXml;
    String paramXml;
    String datasetQuery;
    int regUserNo;
    Date RegDt;
    String delYn;
    String promptYn;
    String reportSubTitle;
    int modUserNo;
    Date modDt;
    String privacyYn;
    String layoutConfig;

    private static String encodeBase64(String string) {
        byte[] encodedBytes = Base64.getEncoder().encode(string.getBytes());
        String encodedString = "";
        try {
            encodedString = new String(encodedBytes, "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return encodedString;
    }

    public static ReportMstrEntity toEntity(ReportMstrDTO reportMstrDTO) {
        String encodedReportXml = null;
    	String encodedChartXml = null;
    	String encodedLayoutXml = null;
    	String encodedParamXml = null;
    	String encodedDatasetQuery = null;

    	if(reportMstrDTO.getReportXml() != null) {
    		encodedReportXml = encodeBase64(reportMstrDTO.getReportXml());
        }
    	if(reportMstrDTO.getChartXml() != null) {
    		encodedChartXml = encodeBase64(reportMstrDTO.getChartXml());
    	}
    	if(reportMstrDTO.getLayoutXml() != null) {
    		encodedLayoutXml = encodeBase64(reportMstrDTO.getLayoutXml());
    	}
    	if(reportMstrDTO.getParamXml() != null) {
    		encodedParamXml = encodeBase64(reportMstrDTO.getParamXml());
    	}
    	if(reportMstrDTO.getDatasetQuery() != null) {
    		encodedDatasetQuery = encodeBase64(reportMstrDTO.getDatasetQuery());
    	}

        return ReportMstrEntity.builder()
        .reportId(reportMstrDTO.getReportId())
        .reportNm(reportMstrDTO.getReportNm())
        .fldId(reportMstrDTO.getFldId())
        .fldType(reportMstrDTO.getFldType())
        .reportOrdinal(reportMstrDTO.getReportOrdinal())
        .reportType(reportMstrDTO.getReportType().toString())
        .reportTag(reportMstrDTO.getReportTag())
        .reportDesc(reportMstrDTO.getReportDesc())
        .reportLayout(reportMstrDTO.getReportLayout())
        .gridInfo(reportMstrDTO.getGridInfo())
        .datasrcId(reportMstrDTO.getDatasrcId())
        .datasrcType(reportMstrDTO.getDatasrcType())
        .datasetType(reportMstrDTO.getDatasetType())
        .reportXml(encodedReportXml)
        .chartXml(encodedChartXml)
        .layoutXml(encodedLayoutXml)
        .paramXml(encodedParamXml)
        .datasetQuery(encodedDatasetQuery)
        .regUserNo(reportMstrDTO.getRegUserNo())
        .RegDt(reportMstrDTO.getRegDt())
        .delYn(reportMstrDTO.getDelYn())
        .promptYn(reportMstrDTO.getPromptYn())
        .reportSubTitle(reportMstrDTO.getReportSubTitle())
        .modUserNo(reportMstrDTO.getModUserNo())
        .modDt(reportMstrDTO.getModDt())
        .privacyYn(reportMstrDTO.getPrivacyYn())
        .layoutConfig(reportMstrDTO.getLayoutConfig())
        .build();
    }
}
