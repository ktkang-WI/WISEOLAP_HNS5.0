package com.wise.MarketingPlatForm.report.domain.xml;

import java.util.Map;

import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;

public interface XMLParser {
	/**
	 * ReportType을 기준으로 XML 데이터를 DTO로 반환합니다.
	 */
	
	public void getReportXmlDTO(String reportXml);
	public void getChartXmlDTO(String chartXml);
	public void getlayoutXmlDTO(String layoutXml);
	public void getDatasetXmlDTO(String datasetXml, String userId);
	public Map<String, Object> getReport(ReportMstrDTO dto, String userId);
}
