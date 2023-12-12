package com.wise.MarketingPlatForm.report.domain.xml.reportTypeParser;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.xml.parsers.DocumentBuilder;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONPointer;
import org.json.XML;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import com.wise.MarketingPlatForm.dataset.service.CubeService;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.type.DataFieldType;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.dataset.vo.CubeFieldVO;
import com.wise.MarketingPlatForm.dataset.vo.QueryFieldVO;
import com.wise.MarketingPlatForm.dataset.vo.RootFieldVO;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.mart.vo.MetaDTO;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.RootData;
import com.wise.MarketingPlatForm.report.domain.data.data.SparkLine;
import com.wise.MarketingPlatForm.report.domain.xml.XMLParser;
import com.wise.MarketingPlatForm.report.domain.xml.vo.LayoutTabVO;
import com.wise.MarketingPlatForm.report.domain.xml.vo.LayoutTabWrapperVO;
import com.wise.MarketingPlatForm.report.type.ItemType;
import com.wise.MarketingPlatForm.report.type.SummaryType;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;

public class DashAnyXmlParser extends XMLParser {

	private JSONArray datasetJsonArray = new JSONArray();

//	private List<String> datasetNm = new ArrayList<>();
//	private List<String> datasetType = new ArrayList<>();
//	private List<Integer> datasrcId = new ArrayList<>();
//	private List<String> datasrcType = new ArrayList<>();
	
	
	// LAYOUT_XML의  DataSource태그의 데이터를 사용하기 위하여 선언 bjsong
	private Map<String, String> datasources = new HashMap<>();
	// pivot_gird 아이템에서 row와 column 정보를 저장하기 위하여 선언 bjsong
	private Map<String, String> rowNCol = new HashMap<>();

	private CubeService cubeService;
	private DatasetService datasetService;

	
	public DashAnyXmlParser(CubeService cubeService, DatasetService datasetService) {
		this.cubeService = cubeService;
		this.datasetService = datasetService;
	}
	
	@Override
	public void getReportXmlDTO(String reportXml) {

	}

	@Override
	public void getChartXmlDTO(String chartXml) {

	}

	@Override
	public void getlayoutXmlDTO(String layoutXml) {
		Map<String, Object> layoutConfig = new HashMap<>();
		
		LayoutTabWrapperVO layoutWrapper = LayoutTabWrapperVO.builder()
				.type("row")
				.weight((double) 100)
				.build();
		
		layoutConfig.put("borders", new ArrayList<String>());
		layoutConfig.put("global", new HashMap<String, Object>(){{
			put("tabEnableClose", false);
			put("tabEnableRename", false);
		}});
		layoutConfig.put("layout", layoutWrapper);
		
		this.layout.put("layoutConfig", layoutConfig);
		
		layoutXml = layoutXml.trim();
		
		try {
			DocumentBuilder builder = factory.newDocumentBuilder(); 
			document = builder.parse(new InputSource(new StringReader(layoutXml)));
			Element root = document.getDocumentElement();
			NodeList children = root.getChildNodes();
			
			for(int layoutIndex = 0; layoutIndex < children.getLength(); layoutIndex++) {
				Node node = children.item(layoutIndex);
				if(node.getNodeType() != Node.ELEMENT_NODE) continue;
				
				switch (node.getNodeName()) {
//				추후 추가
//				case "Title":
//					
//					break;
				case "DataSources":
					NodeList datasourceNodes = node.getChildNodes();
					for(int datasourceIndex = 0; datasourceIndex < datasourceNodes.getLength(); datasourceIndex++) {
						Node datasourceNode = datasourceNodes.item(datasourceIndex);
						if(datasourceNode.getNodeType() != Node.ELEMENT_NODE) continue;
						// value = id
						String componentName = datasourceNode.getAttributes().getNamedItem("ComponentName").getTextContent();
						// key = name
						String Name = datasourceNode.getAttributes().getNamedItem("Name").getTextContent();
						
						this.datasources.put(Name, componentName);
					}
					break;
				case "Items":
					itemsParser(node);
					break;
				case "LayoutTree":
					layoutRecursionParser(node, null, (LayoutTabWrapperVO) layoutWrapper
							, (List<Map<String, Object>>)this.item.get("items"));
					break;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} 
		
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
	        	JSONObject datasetField = datasetJson.optJSONObject("DATASET_FIELD");
	        	List<Object> fields = new ArrayList<>();
	        	if(datasetField != null) {
	        		JSONArray fieldsArray = datasetField.getJSONArray("LIST");
	        		for(int fieldsIndex = 1; fieldsIndex < fieldsArray.length(); fieldsIndex++) {
	        			RootFieldVO field = null;
	        			JSONObject fieldObject = fieldsArray.getJSONObject(fieldsIndex);
	        			String dataType = fieldObject.getString("DATA_TYPE");
	        			String name = fieldObject.getString("CAPTION");
	        			String uniqueName = fieldObject.optString("UNI_NM");
	        			String parentId = Integer.toString(fieldObject.getInt("PARENT_ID"));
	        			Integer order = fieldObject.getInt("ORDER");
	        			DataFieldType type = "MEA".equals(fieldObject.getString("TYPE"))
								? DataFieldType.MEASURE : DataFieldType.DIMENSION;
	        			
		        		if(datasrcType.equals(DsType.CUBE.toString())) {
		        			// 추후 추가
		        			field = CubeFieldVO.builder()
									.dataType(dataType)
									.name(name)
									.type(type)
									.uniqueName(uniqueName)
									.parentId(parentId)
									.order(order)
									.build();
		        		} else if (datasrcType.equals(DsType.DS_SQL.toString())) {
		        			field = QueryFieldVO.builder()
									.dataType(dataType)
									.name(name)
									.type(type)
									.uniqueName(uniqueName)
									.parentId(parentId)
									.build();
		        		}
		        		fields.add(field);
	        		}
	        	} else {
	        		if(datasrcType.equals(DsType.CUBE.toString())) {
	        			// 추후 추가
	        			fields.add(cubeService.getCubeFields());
					} else if(datasrcType.equals(DsType.DS_SQL.toString())) {
						MartResultDTO martDTO = datasetService.getQueryData(datasrcId, datasetQuery);
						fields.add(martDTO.getMetaData());
					}
	        	}
	        	
//	        	this.datasetNm.add(datasetNm);
//	        	this.datasrcId.add(datasrcId);
//	        	this.datasetType.add(datasetType);
//	        	this.datasrcType.add(datasrcType);
	        	
	        	this.dsIdNDsType.put(datasrcId, datasrcType);
	        	
	        	dataset.put("dataSrcId", datasrcId);
	        	dataset.put("datasetNm", datasetNm);
	        	dataset.put("datasetQuery", datasetQuery);
	        	dataset.put("datasetType", datasrcType);
	        	dataset.put("datasetId", this.datasources.get(datasetNm));
	        	dataset.put("fields", fields);
	        	datasets.add(dataset);
			}
	        
			this.dataset.put("selectedDatasetId", this.datasources.values().iterator().next());
			this.dataset.put("datasetQuantity", this.datasetJsonArray.length());
			this.dataset.put("datasets", datasets);
		} catch (Exception e) {
			e.printStackTrace();
		} 
	}
	/**
	 * 
	 * @param layoutNode xml Node
	 * @param parent 상위 Layout
	 * @param allLayouts total Layout
	 * @param items items
	 */
	private void layoutRecursionParser(Node layoutNode, LayoutTabWrapperVO parent,
			LayoutTabWrapperVO allLayouts, List<Map<String, Object>> items) {

		NodeList children = layoutNode.getChildNodes();
		for (int layoutIndex = 0; layoutIndex < children.getLength(); layoutIndex++) {
			if (children.item(layoutIndex).getNodeType() != Node.ELEMENT_NODE)
				continue;

			Node node = children.item(layoutIndex);
			Double weight;

			switch (node.getNodeName()) {
			case "LayoutGroup":
				weight = Double.parseDouble(Optional.ofNullable(node.getAttributes().getNamedItem("Weight"))
						.map(Node::getTextContent).orElse(null));

				LayoutTabWrapperVO layoutWrapper = LayoutTabWrapperVO.builder().type("row").weight(weight).build();

				if (parent == null) {
					allLayouts.getChildren().add(layoutWrapper);
				} else {
					parent.getChildren().add(layoutWrapper);
				}

				layoutRecursionParser(node, layoutWrapper, allLayouts, items);
				break;
			case "LayoutItem":

				weight = Double.parseDouble(Optional.ofNullable(node.getAttributes().getNamedItem("Weight"))
						.map(Node::getTextContent).orElse(null));
				String id = Optional.ofNullable(node.getAttributes().getNamedItem("DashboardItem"))
						.map(Node::getTextContent).orElse(null);

				String component = "";
				String name = "";
				for(int i = 0; i < items.size(); i++) {
					if(items.get(i).get("id").equals(id)) {
						component = items.get(i).get("type").toString();
						name = ((Map<String, Object>) items.get(i).get("meta")).get("name").toString();
					}
					
				}

				LayoutTabVO tab = LayoutTabVO.builder().component(component).id(id).name(name).type("tab").build();

				LayoutTabWrapperVO layoutTabset = LayoutTabWrapperVO.builder().type("tabset").weight(weight).build();

				layoutTabset.getChildren().add(tab);

				if (parent == null) {
					allLayouts.getChildren().add(layoutTabset);
				} else {
					parent.getChildren().add(layoutTabset);
				}
				break;
			// 추후 추가
			// case "LayoutTabContainer":
			// break;
			// case "LayoutTabPage":
			// break;
			}
		}
		
	}

	private void itemsParser(Node itemsNode) {
		NodeList children = itemsNode.getChildNodes();
		List<Map<String, Object>> itemsList = new ArrayList<Map<String, Object>>();

		for (int itemsIndex = 0; itemsIndex < children.getLength(); itemsIndex++) {
			if (children.item(itemsIndex).getNodeType() != Node.ELEMENT_NODE)
				continue;

			Node node = children.item(itemsIndex);

			String itemType = node.getNodeName().toLowerCase();
			ItemType type = null;
			String componentName = node.getAttributes().getNamedItem("ComponentName").getTextContent();
			String datasetId = node.getAttributes().getNamedItem("DataSource").getTextContent();
			String name = node.getAttributes().getNamedItem("Name").getTextContent();
			String memo = Optional.ofNullable(node.getAttributes().getNamedItem("MemoText")).map(Node::getTextContent)
					.orElse(null);
			int dataFieldQuantity = 0;
			Map<String, Object> dataField = new HashMap<String, Object>();
			
			// factory로 전환 부분(ItemType별로)
			List<RootData> fields = new ArrayList<>();
			List<SparkLine> sparklines = new ArrayList<>();
			List<Dimension> dimensions = new ArrayList<>();
			List<Map<String, Object>> dimensionGroups = new ArrayList<>();
			List<Measure> measures = new ArrayList<>();
			
			if (ItemType.CHART.toString().equals(itemType)) {
				type = ItemType.CHART;
				NodeList itemChildren = node.getChildNodes();

				for (int itemChildrenIndex = 0; itemChildrenIndex < itemChildren.getLength(); itemChildrenIndex++) {
					if (itemChildren.item(itemChildrenIndex).getNodeType() != Node.ELEMENT_NODE)
						continue;
					dataFieldQuantity++;

					Node itemChild = itemChildren.item(itemChildrenIndex);
					if ("DataItems".equals(itemChild.getNodeName())) {
						NodeList datas = itemChild.getChildNodes();

						for (int datasIndex = 0; datasIndex < datas.getLength(); datasIndex++) {
							if (datas.item(datasIndex).getNodeType() != Node.ELEMENT_NODE)
								continue;

							Node data = datas.item(datasIndex);
							if (DataFieldType.DIMENSION.toString().equals(data.getNodeName().toLowerCase())) {
								NamedNodeMap dimensionNodes = data.getAttributes();

								String caption = Optional.ofNullable(dimensionNodes.getNamedItem("Name"))
										.map(Node::getTextContent)
										.orElseGet(() -> dimensionNodes.getNamedItem("DataMember").getTextContent());
								String dimName = dimensionNodes.getNamedItem("DataMember").getTextContent();
								String fieldId = dimensionNodes.getNamedItem("UniqueName").getTextContent();

								Dimension dimensoion = Dimension.builder().caption(caption)
										.category(DataFieldType.DIMENSION.toString())
										.fieldId(fieldId)
										.name(dimName)
										.uniqueName(dimName).build();

								dimensions.add(dimensoion);

							} else if (DataFieldType.MEASURE.toString().equals(data.getNodeName().toLowerCase())) {
								NamedNodeMap measureNodes = data.getAttributes();

								String caption = Optional.ofNullable(measureNodes.getNamedItem("Name"))
										.map(Node::getTextContent)
										.orElseGet(() -> measureNodes.getNamedItem("DataMember").getTextContent());
								SummaryType summaryType = SummaryType.fromString(
												measureNodes.getNamedItem("SummaryType").getTextContent().toUpperCase())
												.get();
								String meaName = measureNodes.getNamedItem("DataMember").getTextContent();
								String fieldId = measureNodes.getNamedItem("UniqueName").getTextContent();

								Measure measure = Measure.builder().caption(caption)
										.category(DataFieldType.MEASURE.toString())
										.fieldId(fieldId)
										.name(meaName)
										.uniqueName(meaName)
										.summaryType(summaryType).build();

								measures.add(measure);
							}
						}
					}
				}
				dataField.put("datasetId", datasetId);
				dataField.put("dimension", dimensions);
				dataField.put("measure", measures);
				dataField.put("dimensionGroup", dimensionGroups);
				dataField.put("dataFieldQuantity", dataFieldQuantity);

			} else if (ItemType.DATA_GRID.toString().equals(itemType)) {
				type = ItemType.DATA_GRID;
				NodeList itemChildren = node.getChildNodes();

				for (int itemChildrenIndex = 0; itemChildrenIndex < itemChildren.getLength(); itemChildrenIndex++) {
					if (itemChildren.item(itemChildrenIndex).getNodeType() != Node.ELEMENT_NODE)
						continue;

					Node itemChild = itemChildren.item(itemChildrenIndex);
					if ("DataItems".equals(itemChild.getNodeName())) {
						NodeList datas = itemChild.getChildNodes();

						for (int datasIndex = 0; datasIndex < datas.getLength(); datasIndex++) {
							if (datas.item(datasIndex).getNodeType() != Node.ELEMENT_NODE)
								continue;

							Node data = datas.item(datasIndex);
							if (DataFieldType.DIMENSION.toString().equals(data.getNodeName().toLowerCase())) {
								NamedNodeMap dimensionNodes = data.getAttributes();
								String caption = Optional.ofNullable(dimensionNodes.getNamedItem("Name"))
										.map(Node::getTextContent)
										.orElseGet(() -> dimensionNodes.getNamedItem("DataMember").getTextContent());
								String dimName = dimensionNodes.getNamedItem("DataMember").getTextContent();
								String fieldId = dimensionNodes.getNamedItem("UniqueName").getTextContent();
								DataFieldType dataType = DataFieldType.DIMENSION;

								Dimension dimension = Dimension.builder().caption(caption)
										.category(DataFieldType.FIELD.toString()).fieldId(fieldId).name(dimName)
										.type(dataType).uniqueName(dimName).build();

								fields.add(dimension);
							} else if (DataFieldType.MEASURE.toString().equals(data.getNodeName().toLowerCase())) {
								NamedNodeMap measureNodes = data.getAttributes();

								String caption = Optional.ofNullable(measureNodes.getNamedItem("Name"))
										.map(Node::getTextContent)
										.orElseGet(() -> measureNodes.getNamedItem("DataMember").getTextContent());
								SummaryType summaryType = SummaryType
										.fromString(
												measureNodes.getNamedItem("SummaryType").getTextContent().toUpperCase())
										.get();
								String meaName = measureNodes.getNamedItem("DataMember").getTextContent();
								String fieldId = measureNodes.getNamedItem("UniqueName").getTextContent();
								DataFieldType dataType = DataFieldType.MEASURE;

								Measure measure = Measure.builder().caption(caption)
										.category(DataFieldType.MEASURE.toString()).fieldId(fieldId).name(meaName)
										.uniqueName(meaName).summaryType(summaryType).build();
								fields.add(measure);
							}
							// else if(sparkLine 추후 추가)
							dataField.put("datasetId", datasetId);
							dataField.put("field", fields);
							dataField.put("sparkline", new ArrayList<String>());
						}
					}

				}
			} else if(ItemType.PIVOT_GRID.toString().equals(itemType)) {
				type = ItemType.PIVOT_GRID;
				NodeList itemChildren = node.getChildNodes();

				for (int itemChildrenIndex = 0; itemChildrenIndex < itemChildren.getLength(); itemChildrenIndex++) {
					if (itemChildren.item(itemChildrenIndex).getNodeType() != Node.ELEMENT_NODE)
						continue;

					Node itemChild = itemChildren.item(itemChildrenIndex);
					if ("DataItems".equals(itemChild.getNodeName())) {
						NodeList datas = itemChild.getChildNodes();

						for (int datasIndex = 0; datasIndex < datas.getLength(); datasIndex++) {
							if (datas.item(datasIndex).getNodeType() != Node.ELEMENT_NODE)
								continue;

							Node data = datas.item(datasIndex);
							if (DataFieldType.DIMENSION.toString().equals(data.getNodeName().toLowerCase())) {
								NamedNodeMap dimensionNodes = data.getAttributes();
								String caption = Optional.ofNullable(dimensionNodes.getNamedItem("Name"))
										.map(Node::getTextContent)
										.orElseGet(() -> dimensionNodes.getNamedItem("DataMember").getTextContent());
								String dimName = dimensionNodes.getNamedItem("DataMember").getTextContent();
								String fieldId = dimensionNodes.getNamedItem("UniqueName").getTextContent();
								DataFieldType dataType = DataFieldType.DIMENSION;

								Dimension dimension = Dimension.builder().caption(caption)
										.category(DataFieldType.FIELD.toString()).fieldId(fieldId).name(dimName)
										.type(dataType).uniqueName(dimName).build();

								fields.add(dimension);
							} else if (DataFieldType.MEASURE.toString().equals(data.getNodeName().toLowerCase())) {
								NamedNodeMap measureNodes = data.getAttributes();

								String caption = Optional.ofNullable(measureNodes.getNamedItem("Name"))
										.map(Node::getTextContent)
										.orElseGet(() -> measureNodes.getNamedItem("DataMember").getTextContent());
								SummaryType summaryType = SummaryType
										.fromString(
												measureNodes.getNamedItem("SummaryType").getTextContent().toUpperCase())
										.get();
								String meaName = measureNodes.getNamedItem("DataMember").getTextContent();
								String fieldId = measureNodes.getNamedItem("UniqueName").getTextContent();
								DataFieldType dataType = DataFieldType.MEASURE;

								Measure measure = Measure.builder().caption(caption)
										.category(DataFieldType.MEASURE.toString()).fieldId(fieldId).name(meaName)
										.uniqueName(meaName).summaryType(summaryType).build();
								fields.add(measure);
							}
						}
					} else if ("Columns".equals(itemChild.getNodeName())) {
						NodeList columnNodes = itemChild.getChildNodes();
						for (int columnNodesIndex = 0; columnNodesIndex < columnNodes.getLength(); columnNodesIndex++) {
							if (columnNodes.item(columnNodesIndex).getNodeType() != Node.ELEMENT_NODE)
								continue;
							String colUniNm = columnNodes.item(columnNodesIndex).getAttributes().getNamedItem("UniqueName").getTextContent();
							this.rowNCol.put(colUniNm, "col");
						}
					} else if ("Rows".equals(itemChild.getNodeName())) {
						NodeList rowNodes = itemChild.getChildNodes();
						for (int rowNodesIndex = 0; rowNodesIndex < rowNodes.getLength(); rowNodesIndex++) {
							if (rowNodes.item(rowNodesIndex).getNodeType() != Node.ELEMENT_NODE)
								continue;
							String rowUniNm = rowNodes.item(rowNodesIndex).getAttributes().getNamedItem("UniqueName").getTextContent();	
							this.rowNCol.put(rowUniNm, "row");
						}
					}
				}
				List<Object> measure = new ArrayList<>(); 
				List<Object> column = new ArrayList<>(); 
				List<Object> row = new ArrayList<>(); 
				
				for(int fieldsIndex = 0; fieldsIndex<fields.size(); fieldsIndex++) {
					RootData field = (RootData) fields.get(fieldsIndex);
					if(field instanceof Dimension) {
						String pivotType = this.rowNCol.get(((Dimension) field).getFieldId());
						if(pivotType.equals("col")) {
							column.add(field);
						} else if(pivotType.equals("row")) {
							row.add(field);
						}
					} else if (field instanceof Measure) {
						measure.add(field);
					}
				}
				
				dataField.put("row", row);
				dataField.put("column", column);
				dataField.put("measure", measure);
				dataField.put("dataFieldQuantity", fields.size());
				dataField.put("datasetId", datasetId);
				
			}
			Map<String, Object> meta = new HashMap<>();
			meta.put("dataField", dataField);
			meta.put("memo", memo);
			meta.put("name", name);
			meta.put("useCaption", name);
			
			Map<String, Object> items = new HashMap<>();
			items.put("id", componentName);
			items.put("type", type.toString());
			items.put("meta", meta);
			itemsList.add(items);
		}
		this.item.put("itemQuantity", itemsList.size());
		this.item.put("selectedItemId", itemsList.get(0).get("id"));
		this.item.put("items", itemsList);
	}

	@Override
	public Map<String, Object> getReport(ReportMstrDTO dto, String userId) {
		this.getlayoutXmlDTO(dto.getLayoutXml());
		this.getDatasetXmlDTO(dto.getDatasetXml(), userId);
		this.getChartXmlDTO(dto.getChartXml());
		this.getReportXmlDTO(dto.getReportXml());
//		this.getParamXmlDTO(dto.getParamXml());
		
		this.returnReport.put("dataset", this.dataset);
		this.returnReport.put("item", this.item);
		this.returnReport.put("layout", this.layout);
		this.returnReport.put("informations", this.informations);
		return returnReport;
	}
}
