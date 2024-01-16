package com.wise.MarketingPlatForm.report.domain.xml.reportTypeParser;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONPointer;
import org.json.XML;

import com.wise.MarketingPlatForm.dataset.service.CubeService;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.type.DataFieldType;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.dataset.vo.CubeFieldVO;
import com.wise.MarketingPlatForm.dataset.vo.QueryFieldVO;
import com.wise.MarketingPlatForm.dataset.vo.RootFieldVO;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.report.domain.xml.XMLParser;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;

public class ExcelXmlParser extends XMLParser{

	private JSONArray datasetJsonArray = new JSONArray();

	private CubeService cubeService;
	private DatasetService datasetService;
	
	public ExcelXmlParser(CubeService cubeService, DatasetService datasetService) {
		this.cubeService = cubeService;
		this.datasetService = datasetService;
	}
	
	@Override
	public void getReportXmlDTO(String reportXml) {
		
		
	}

	@Override
	public void getChartXmlDTO(String chartXml) {
		JSONObject returnSheet = new JSONObject();
		JSONObject root = XML.toJSONObject(chartXml);
		JSONPointer exdendedNamePointer = new JSONPointer("/EXCEL_XML/FILE_EXT_ELEMENT/FILE_EXT");
		String exdendedName = (String) exdendedNamePointer.queryFrom(root);
		if(exdendedName != null) {
			JSONPointer sheetsePointer = new JSONPointer("/EXCEL_XML/SHEET_ELEMENT/VISIBLE_SHEET");
			Object sheets = exdendedNamePointer.queryFrom(root);
			
			JSONArray sheetsArray = new JSONArray();
			if (sheets instanceof JSONObject) {
				sheetsArray.put((JSONObject) sheets);
			} else if (sheets instanceof JSONArray) {
				sheetsArray = (JSONArray) sheets;
			} else {
				new Exception("EXCEL REPORT_XML not found or has unexpected format.");
			}
			int sheetsLength = sheetsArray.length();
			
			for (int index = 0; index < sheetsLength; index++) {
				JSONObject sheet = sheetsArray.getJSONObject(index);
				((List<Map<String, Object>>) this.dataset.get("datasets")).forEach((dataset) -> {
					if(sheet.get("SHEET_ID").equals(dataset.get("datasetNm"))) {
						JSONObject innerObj = new JSONObject();
						innerObj.put("visible", sheet.get("VISIBLE"));
						Map<String, Integer> position = positionConvertor((String) sheet.get("START_POS"));
						innerObj.put("columnIndex", position.get("columnIndex"));
						innerObj.put("rowIndex", position.get("rowIndex"));
						innerObj.put("useHeader", stringToBoolean((String) sheet.get("SHOW_HEADER")));
						innerObj.put("useBorder", stringToBoolean((String) sheet.get("SHOW_LINE")));
						returnSheet.put((String) sheet.get("SHEET_ID"), innerObj);
					}
				});
			}	
		}
		this.spread.put("spread", returnSheet);
	}
	
	private boolean stringToBoolean(String str) {
		if(str.equals("표시")) {
			return true;
		} else { 
			return false;
		}
	}
	
	private HashMap<String, Integer> positionConvertor (String position) {
		String alphabet =  "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		HashMap<String, Integer> newPosition = new HashMap<>();
		String regex = "([a-zA-Z]+)(\\d+)";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(position);
		if (matcher.matches()) {
            String letters = matcher.group(1);
            String[] charArray = letters.chars()
                    .mapToObj(c -> String.valueOf((char) c))
                    .toArray(String[]::new);
            Integer numbers = Integer.parseInt(matcher.group(2));
            int lettersLength = charArray.length;
            int alphabetIndex = 0;
            for (int index = 1; index < lettersLength + 1; index++) {
            	alphabetIndex += (alphabet.indexOf(charArray[index - 1]) + 1) * index;
            }
            newPosition.put("columnIndex", alphabetIndex);
            newPosition.put("rowIndex", numbers);
        } else {
            new Exception("spread Position Parse Error");
        }
		
		return newPosition;
	}

	@Override
	public void getlayoutXmlDTO(String layoutXml) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void getDatasetXmlDTO(String datasetXml, String userId) {
		try {
			JSONObject root = XML.toJSONObject(datasetXml);
			JSONPointer pointer = new JSONPointer("/DATASET_XML/DATASET_ELEMENT/DATASET");
			Object result = pointer.queryFrom(root);

			if (result instanceof JSONObject) {
				this.datasetJsonArray.put((JSONObject) result);
			} else if (result instanceof JSONArray) {
				this.datasetJsonArray = (JSONArray) result;
			} else {
				super.log.error("DATA_SET not found or has unexpected format.");
			}

			List<Map<String, Object>> datasets = new ArrayList<>();

			for (int datasetArrayIndex = 0; datasetArrayIndex < this.datasetJsonArray.length(); datasetArrayIndex++) {
				Map<String, Object> dataset = new HashMap<>();

				JSONObject datasetJson = this.datasetJsonArray.getJSONObject(datasetArrayIndex);
				String datasetNm = datasetJson.getString("DATASET_NM");
				Integer datasrcId = datasetJson.getInt("DATASRC_ID");
				String datasetType = datasetJson.getString("DATASET_TYPE");
				String datasrcType = datasetJson.getString("DATASRC_TYPE");
				String datasetQuery = datasetJson.getString("DATASET_QUERY");
				String sheetNm = datasetJson.getString("SHEET_ID");
				JSONObject datasetField = datasetJson.optJSONObject("DATASET_FIELD");
				List<Object> fields = new ArrayList<>();
				if (datasetField != null) {
					JSONArray fieldsArray = datasetField.getJSONArray("LIST");
					for (int fieldsIndex = 1; fieldsIndex < fieldsArray.length(); fieldsIndex++) {
						RootFieldVO field = null;
						JSONObject fieldObject = fieldsArray.getJSONObject(fieldsIndex);
						String dataType = fieldObject.getString("DATA_TYPE");
						String name = fieldObject.getString("CAPTION");
						String uniqueName = fieldObject.optString("UNI_NM");
						String parentId = Integer.toString(fieldObject.getInt("PARENT_ID"));
						Integer order = fieldObject.getInt("ORDER");
						DataFieldType type = "MEA".equals(fieldObject.getString("TYPE")) ? DataFieldType.MEASURE
								: DataFieldType.DIMENSION;

						if (datasrcType.equals(DsType.CUBE.toString())) {
							// 추후 추가
							field = CubeFieldVO.builder().dataType(dataType).name(name).type(type)
									.uniqueName(uniqueName).parentId(parentId).order(order).build();
						} else if (datasrcType.equals(DsType.DS_SQL.toString())) {
							field = QueryFieldVO.builder().dataType(dataType).name(name).type(type)
									.uniqueName(uniqueName).parentId(parentId).build();
						}
						fields.add(field);
					}
				} else {
					if (datasrcType.equals(DsType.CUBE.toString())) {
						// 추후 추가
						fields.add(cubeService.getCubeFields());
					} else if (datasrcType.equals(DsType.DS_SQL.toString())) {
						MartResultDTO martDTO = datasetService.getQueryData(datasrcId, datasetQuery);
						fields.add(martDTO.getMetaData());
					}
				}

				dataset.put("dataSrcId", datasrcId);
				dataset.put("datasetNm", datasetNm);
				dataset.put("datasetQuery", datasetQuery);
				dataset.put("datasetType", datasrcType);
				dataset.put("datasetNm", datasetNm);
				// spread보고서는 datasetId가 없음.
//				dataset.put("datasetId", this.dsNmWithInfo.get(datasetNm).get("dataSource"));
				dataset.put("fields", fields);
				datasets.add(dataset);
			}
			
			// spread보고서는 datasetId가 없음.
			this.dataset.put("selectedDatasetId", datasets.get(0).get("datasetId"));
			this.dataset.put("datasetQuantity", this.datasetJsonArray.length());
			this.dataset.put("datasets", datasets);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public Map<String, Object> getReport(ReportMstrDTO dto, String userId) {
		this.getDatasetXmlDTO(dto.getDatasetXml(), userId);
		this.returnReport.put("dataset", this.dataset);
		return returnReport;
	}

	@Override
	public void getParamXmlDTO(String paramXml) {
		// TODO Auto-generated method stub
		
	}
}
