package com.wise.MarketingPlatForm.report.entity;

import java.sql.Date;
import java.util.Base64;

import com.wise.MarketingPlatForm.report.type.ReportType;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;
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
public class ReportMstrEntity {
    int reportId;
    String reportNm;
    int fldId;
    String fldType;
    int reportOrdinal;
    String reportType;
    @Builder.Default
    String reportTag = "";
    @Builder.Default
    String reportDesc = "";
    @Builder.Default
    String reportSubTitle = "";
    String reportLayout;
    String gridInfo;
    int dataSrcId;
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
    int modUserNo;
    Date modDt;
    String privacyYn;
    String layoutConfig;
    String dupleYn;

    private static String decodeBase64(String base64, boolean datasetCheck) {
    	byte[] decodedBytes = null;
    	String decodedString = "";
    	try {
        decodedBytes = Base64.getDecoder().decode(
            base64.replaceAll("\\R", ""));
        	decodedString = new String(decodedBytes, "UTF-8");
        	if(!datasetCheck) {
        		decodedString = decodedString.replaceAll("&lt;", "<");
        		decodedString = decodedString.replaceAll("&gt;", ">");
        	}
        } catch (Exception e) {
        	return decodedString = "newReport";
        }
        return decodedString;
    }
    
    public static ReportMstrDTO toDTO(ReportMstrEntity reportMstrEntity) {
    	String decodedReportXml = null;
    	String decodedChartXml = null;
    	String decodedLayoutXml = null;
    	String decodedParamXml = null;
    	String decodedDatasetQuery = null;
    	String decodedDatasetXml = null;
    	
    	if(reportMstrEntity.getReportXml() != null) {
    		decodedReportXml = decodeBase64(reportMstrEntity.getReportXml(), false);
        }
    	if(reportMstrEntity.getChartXml() != null) {
    		decodedChartXml = decodeBase64(reportMstrEntity.getChartXml(), false);
    	}
    	if(reportMstrEntity.getLayoutXml() != null) {
    		decodedLayoutXml = decodeBase64(reportMstrEntity.getLayoutXml(), false);
    	}
    	if(reportMstrEntity.getParamXml() != null) {
    		decodedParamXml = decodeBase64(reportMstrEntity.getParamXml(), false);
    	}
    	if(reportMstrEntity.getDatasetQuery() != null) {
    		decodedDatasetQuery = decodeBase64(reportMstrEntity.getDatasetQuery(), false);
    	}
    	if(reportMstrEntity.getDatasetXml() != null) {
    		decodedDatasetXml = decodeBase64(reportMstrEntity.getDatasetXml(), true);
    	}
        
        return ReportMstrDTO.builder()
	        .reportId(reportMstrEntity.getReportId())
	        .reportNm(reportMstrEntity.getReportNm())
	        .fldId(reportMstrEntity.getFldId())
	        .fldType(reportMstrEntity.getFldType())
	        .reportOrdinal(reportMstrEntity.getReportOrdinal())
	        .reportType(ReportType.fromString(reportMstrEntity.getReportType()).orElse(null))
	        .reportTag(reportMstrEntity.getReportTag())
	        .reportDesc(reportMstrEntity.getReportDesc())
	        .reportLayout(reportMstrEntity.getReportLayout())
	        .gridInfo(reportMstrEntity.getGridInfo())
	        .dataSrcId(reportMstrEntity.getDataSrcId())
	        .datasrcType(reportMstrEntity.getDatasrcType())
	        .datasetType(reportMstrEntity.getDatasetType())
	        .reportXml(decodedReportXml)  
	        .chartXml(decodedChartXml)
	        .layoutXml(decodedLayoutXml)
	        .datasetQuery(decodedDatasetQuery)
	        .datasetXml(decodedDatasetXml)
	        .paramXml(decodedParamXml)
	        .regUserNo(reportMstrEntity.getRegUserNo())
	        .RegDt(reportMstrEntity.getRegDt())
	        .delYn(reportMstrEntity.getDelYn())
	        .promptYn(reportMstrEntity.getPromptYn())
	        .reportSubTitle(reportMstrEntity.getReportSubTitle())
	        .modUserNo(reportMstrEntity.getModUserNo())
	        .modDt(reportMstrEntity.getModDt())
	        .dupleYn(reportMstrEntity.getDupleYn())
	        .privacyYn(reportMstrEntity.getPrivacyYn())
	        .layoutConfig(reportMstrEntity.getLayoutConfig())
	        .build();
    }
}
