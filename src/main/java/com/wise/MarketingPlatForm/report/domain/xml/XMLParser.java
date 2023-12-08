package com.wise.MarketingPlatForm.report.domain.xml;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.w3c.dom.Document;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import com.wise.MarketingPlatForm.data.file.SummaryMatrixFileWriterService;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.dataset.type.paramDSType;
import com.wise.MarketingPlatForm.global.util.StringSwapper;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;

public abstract class XMLParser {
	/**
	 * 모든 보고서에서 공통으로 필드
	 */
	protected static Logger log = LoggerFactory.getLogger(SummaryMatrixFileWriterService.class);
	protected static final DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
	protected Document document;
	
	protected Map<String, Object> dataset = new HashMap<>();
	protected Map<String, Object> item = new HashMap<>();
	protected Map<String, Object> layout = new HashMap<>();
	protected List<Object> informations = new ArrayList<>();
	protected Map<String, Object> returnReport = new HashMap<>();
	
	// 추상클래스
	protected abstract void getReportXmlDTO(String reportXml);
	protected abstract void getChartXmlDTO(String chartXml);
	protected abstract void getlayoutXmlDTO(String layoutXml);
	protected abstract void getDatasetXmlDTO(String datasetXml, String userId);
	
	// parameter의 information에서 dsId와 DsType을 추가하기 위하여 사용하는 필드.
	protected Map<Integer, String> dsIdNDsType = new HashMap<>();
	
	
	/**
	 * filter의 경우 모든 보고서에 공통으로 적용됨으로 불필요한 코드량을 줄이기 위하여 여기에 선언
	 * @param paramXml
	 */
	protected void getParamXmlDTO(String paramXml) {
		try {
			DocumentBuilder builder = factory.newDocumentBuilder(); 
			this.document = builder.parse(new InputSource(new StringReader(paramXml)));
			Element root = document.getDocumentElement();
			
			NodeList paramList = root.getElementsByTagName("PARAM");
			
			for(int paramIndex = 0; paramIndex < paramList.getLength(); paramIndex++) {
				Map<String, Object> information = new HashMap<>();
				Node paramNode = paramList.item(paramIndex);
				if(paramNode.getNodeType() != Node.ELEMENT_NODE) continue;
				Element paramElement = (Element) paramNode;
				String dataSrcType = paramElement.getElementsByTagName("DATASRC_TYPE").item(0).getTextContent();
				
					NodeList paramConfigNodes = paramNode.getChildNodes();
					for(int configIndex = 0; configIndex < paramConfigNodes.getLength(); configIndex++) {
						Node configNode = paramConfigNodes.item(configIndex);
						if(configNode.getNodeType() != Node.ELEMENT_NODE) continue;
						
						if("PARAM_CAPTION".equals(configNode.getNodeName())) {
							information.put("caption", configNode.getTextContent());
						} else if ("DATA_TYPE".equals(configNode.getNodeName())) {
							information.put("dataType", configNode.getTextContent());
						} else if ("DATASRC_TYPE".equals(configNode.getNodeName())) {
							information.put("dataSourceType", configNode.getTextContent());
						} else if ("DATASRC".equals(configNode.getNodeName())) {
							information.put("dataSource", configNode.getTextContent());
						} else if ("CAPTION_VALUE_ITEM".equals(configNode.getNodeName())) {
							information.put("itemCaption", configNode.getTextContent());
						} else if ("KEY_VALUE_ITEM".equals(configNode.getNodeName())) {
							information.put("itemKey", configNode.getTextContent());
						} else if ("DEFAULT_VALUE".equals(configNode.getNodeName())) {
							if(dataSrcType.equals("CAND")) {
								information.put("defaultValue", new ArrayList<Object>() {{
									add(configNode.getTextContent());
								}});
							} else {
								information.put("defaultValue", configNode.getTextContent());
							}
						} else if ("CAPTION_WIDTH".equals(configNode.getNodeName())) {
							information.put("captionWidth", Double.parseDouble(configNode.getTextContent()));
						} else if ("DS_ID".equals(configNode.getNodeName())) {
							information.put("dsId", Integer.parseInt(configNode.getTextContent()));
						} else if ("WHERE_CLAUSE".equals(configNode.getNodeName())) {
							information.put("exceptionValue", configNode.getTextContent());
						} else if ("DEFAULT_VALUE_USE_SQL_SCRIPT".equals(configNode.getNodeName())) {
							information.put("defaultValueUseSql", StringSwapper.YNToBoolean(configNode.getTextContent()));
						} else if ("MULTI_SEL".equals(configNode.getNodeName())) {
							information.put("multiselect", StringSwapper.YNToBoolean(configNode.getTextContent()));
						} else if ("PARAM_NM".equals(configNode.getNodeName())) {
							information.put("name", configNode.getTextContent());
						} else if ("OPER".equals(configNode.getNodeName())) {
							information.put("operation", configNode.getTextContent().toUpperCase());
						} else if ("ORDER".equals(configNode.getNodeName())) {
							information.put("order", configNode.getTextContent());
						} else if ("PARAM_TYPE".equals(configNode.getNodeName())) {
							information.put("paramType", paramDSType.fromString(configNode.getTextContent()));
						} else if ("ALL_YN".equals(configNode.getNodeName())) {
							information.put("useAll", StringSwapper.YNToBoolean(configNode.getTextContent()));
						} else if ("VISIBLE".equals(configNode.getNodeName())) {
							information.put("visible", StringSwapper.YNToBoolean(configNode.getTextContent()));
						} else if ("WIDTH".equals(configNode.getNodeName())) {
							information.put("width", Double.parseDouble(configNode.getTextContent()));
						} else if ("CAPTION_WIDTH_VISIBLE".equals(configNode.getNodeName())) {
							information.put("useCaptionWidth", StringSwapper.YNToBoolean(configNode.getTextContent()));
						} else if ("SORT_VALUE_ITEM".equals(configNode.getNodeName())) {
							information.put("sortBy", configNode.getTextContent());
						} else if ("SORT_TYPE".equals(configNode.getNodeName())) {
							information.put("sortOrder", configNode.getTextContent());
						}
						
					} 
					if(dataSrcType.equals("CAND")) {
						information.put("calendarDefaultType", "NOW");
						information.put("calendarDefaultType", new ArrayList() {{
							add("YEAR");
							add("");
						}});
						information.put("calendarKeyFormat", "yyyy");
						information.put("calendarCaptionFormat", "yyyy");
						information.put("calendarPeriodValue", new ArrayList() {{
							add(-1);
							add("");
						}});
					}
					information.put("dsType", this.dsIdNDsType.get((Integer) information.get("dsId")));
					this.informations.add(information);
//				추후 추가 예정
//				else if() {
//					
//				}
				
			}
		} catch (Exception e) {
			 e.printStackTrace();
		}
		
	};
	
	public abstract Map<String, Object> getReport(ReportMstrDTO dto, String userId);
}
