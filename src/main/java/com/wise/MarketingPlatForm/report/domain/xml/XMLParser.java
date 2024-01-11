package com.wise.MarketingPlatForm.report.domain.xml;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.w3c.dom.Document;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONPointer;
import org.json.XML;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import com.wise.MarketingPlatForm.data.file.SummaryMatrixFileWriterService;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.global.util.DBDataUtility;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;

public abstract class XMLParser {
	/**
	 * 모든 보고서에서 공통으로 필드
	 */
	protected Logger log = LoggerFactory.getLogger(SummaryMatrixFileWriterService.class);
	protected DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
	protected Document document;
	
	protected Map<String, Object> dataset = new HashMap<>();
	protected Map<String, Object> item = new HashMap<>();
	protected Map<String, Object> layout = new HashMap<>();
	protected Map<String, Object> spread = new HashMap<>();
	protected List<Object> informations = new ArrayList<>();
	protected Map<String, Object> returnReport = new HashMap<>();
	
	// 추상클래스
	protected abstract void getReportXmlDTO(String reportXml);
	protected abstract void getChartXmlDTO(String chartXml);
	protected abstract void getlayoutXmlDTO(String layoutXml);
	protected abstract void getDatasetXmlDTO(String datasetXml, String userId);
	
	// dataSource에 관련된 정보를 저장
	/** 데이터 구조
	 * { dsNm : {
	 * 			dataSource: dataset1,
	 * 			dsId: 3512,
	 * 			dsType: DS_SQL
	 * 			}
	 * LayoutXml에서 dsNm을 키값으로 dataSource을 파싱하여 저장 이후에 datasetXml에서 dsType, dsId를 저장
	 */
	protected Map<String, HashMap<String, Object>> dsNmWithInfo = new HashMap<>();
	
	// param의 information의 변경된 키캆을 가지는 Mapper
	private Map<String, String> informationKeyMapper = keyMapperCreator();
	private Map<String, String> operationMapper = operationMapperCreator();
	
	/**
	 * filter의 경우 모든 보고서에 공통으로 적용됨으로 불필요한 코드량을 줄이기 위하여 여기에 선언
	 * @param String paramXml : REPORT_MSTR 의 PARAM_XML 컬럼.
	 */
	protected void getParamXmlDTO(String paramXml) {
		try {
			JSONObject root = XML.toJSONObject(paramXml);
			JSONObject paramObject = root.optJSONObject("PARAM_XML");
			if(paramObject == null) return;
			
			Object paramsArr = paramObject.opt("PARAM");
						
			if (paramsArr instanceof JSONObject) {
				getParameter((JSONObject) paramsArr);
	        } else if (paramsArr instanceof JSONArray) {
	        	((JSONArray) paramsArr).forEach((paramObj) -> {
	        		getParameter((JSONObject) paramObj);
	        	});
	        }
		} catch (Exception e) {
			 e.printStackTrace();
		}
		
	};
	
	private void getParameter (JSONObject paramObj) {
		Iterator<String> paramKeys = paramObj.keys();
		Map<String, Object> information = new HashMap<>();
		
		while (paramKeys.hasNext()) {
			String paramKey = paramKeys.next();
			Object param = paramObj.get(paramKey);
			
			if("".equals(param) || param == null) continue;
			if(this.informationKeyMapper.get(paramKey) == null) continue;
			
			if("TBL".equals(param)) param = "TABLE";
			
			if("OPER".equals(paramKey)) {
				param = this.operationMapper.get(param);
			}
			
			if("DEFAULT_VALUE".equals(paramKey) || "CAND_PERIOD_BASE".equals(paramKey)) {
				String strParam = param.toString();
				ArrayList<String> arrayList = new ArrayList<>(Arrays.asList(strParam.split(",")));
				if(arrayList.size() == 1) {
					arrayList.add("");
				}
				param = arrayList;
			}
			
			if("Y".equals(param) || "N".equals(param)) {
				param = DBDataUtility.parseBooleanByString((String)param);
			}
			
			Object dsType = null;
			if("DS_ID".equals(paramKey)) {
				dsType = this.dsNmWithInfo.values()
					    .stream()
					    .filter(dataSourceInfo -> dataSourceInfo.get("dsId").equals(paramObj.get(paramKey)))
					    .map(dataSourceInfo -> dataSourceInfo.get("dsType"))
						.findFirst();
				
				information.put("dsType", dsType);
			}
			information.put(this.informationKeyMapper.get(paramKey), param);
		}
		
		this.informations.add(information);
	};
	
	
	private HashMap<String, String> operationMapperCreator () {
		return new HashMap<String, String> (){{
			put("In", "IN");
			put("NotIn", "NOT_IN");
			put("Equals", "EQUALS");
			put("Between", "BETWEEN");
		}};
	};
	
	private HashMap<String, String> keyMapperCreator () {
		return new HashMap<String, String> (){{
			put("PARAM_NM", "name");
			put("PARAM_CAPTION", "caption");
			put("DATA_TYPE", "dataType");
			put("PARAM_TYPE", "paramType");
			put("OPER", "operation");
			put("ORDER", "order");
			put("LINE_BREAK", "lineBreak");
			put("SEARCH_YN", "useSearch");
			put("WIDTH", "width");
			put("VISIBLE", "visible");
			put("CAPTION_WIDTH_VISIBLE", "useCaptionWidth");
			put("CAPTION_WIDTH", "captionWidth");
			put("DEFAULT_VALUE", "defaultValue");
			put("DEFAULT_VALUE_USE_SQL_SCRIPT", "defaultValueUseSql");
			put("WHERE_CLAUSE", "exceptionValue");
			put("DS_ID", "dsId");
			put("DATASRC_TYPE", "dataSourceType");
			put("DATASRC", "dataSource");
			put("CAPTION_VALUE_ITEM", "itemCaption");
			put("KEY_VALUE_ITEM", "itemKey");
			put("ORDERBY_KEY", "sortBy");
			put("SORT_TYPE", "sortOrder");
			put("MULTI_SEL", "multiSelect");
			put("ALL_YN", "useAll");
			put("CAND_DEFAULT_TYPE", "calendarDefaultType");
			put("CAND_PERIOD_BASE", "calendarPeriodBase");
			put("KEY_FORMAT", "calendarKeyFormat");
			put("CAPTION_FORMAT", "calendarCaptionFormat");
			put("CAND_PERIOD_VALUE", "calendarPeriodValue");
		}};
	}
	
	public abstract Map<String, Object> getReport(ReportMstrDTO dto, String userId);
}
