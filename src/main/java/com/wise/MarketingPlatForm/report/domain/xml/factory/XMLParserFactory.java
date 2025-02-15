package com.wise.MarketingPlatForm.report.domain.xml.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.wise.MarketingPlatForm.dataset.service.CubeService;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.report.domain.xml.ReportXMLParser;
import com.wise.MarketingPlatForm.report.domain.xml.reportTypeParser.AdHocXmlParser;
import com.wise.MarketingPlatForm.report.domain.xml.reportTypeParser.DashAnyXmlParser;
import com.wise.MarketingPlatForm.report.domain.xml.reportTypeParser.ExcelXmlParser;
import com.wise.MarketingPlatForm.report.type.ReportType;

@Component
public class XMLParserFactory {
	@Autowired
	CubeService cubeService;
	
	@Autowired
	DatasetService datasetService;
	
	public ReportXMLParser getXmlParser(ReportType reportType) {
        if (reportType == ReportType.DASH_ANY) {
            return new DashAnyXmlParser(cubeService, datasetService);
        }
        if (reportType == ReportType.EXCEL) {
        	return new ExcelXmlParser(cubeService, datasetService);
        }
        if (reportType == ReportType.AD_HOC) {
        	return new AdHocXmlParser();
        }

        return null;
    }
}
