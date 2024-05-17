package com.wise.MarketingPlatForm.report.domain.xml.reportTypeParser;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
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
import com.wise.MarketingPlatForm.report.domain.xml.ReportXMLParser;
import com.wise.MarketingPlatForm.report.domain.xml.vo.LayoutTabVO;
import com.wise.MarketingPlatForm.report.domain.xml.vo.LayoutTabWrapperVO;
import com.wise.MarketingPlatForm.report.type.ItemType;
import com.wise.MarketingPlatForm.report.type.SummaryType;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;

public class DashAnyXmlParser extends ReportXMLParser {

	private JSONArray datasetJsonArray = new JSONArray();

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

		LayoutTabWrapperVO layoutWrapper = LayoutTabWrapperVO.builder().type("row").weight((double) 100).build();

		layoutConfig.put("borders", new ArrayList<String>());
		layoutConfig.put("global", new HashMap<String, Object>() {
			{
				put("tabEnableClose", false);
				put("tabEnableRename", false);
			}
		});
		layoutConfig.put("layout", layoutWrapper);

		this.layout.put("layoutConfig", layoutConfig);

		layoutXml = layoutXml.trim();

		try {
			DocumentBuilder builder = factory.newDocumentBuilder();
			document = builder.parse(new InputSource(new StringReader(layoutXml)));
			Element root = document.getDocumentElement();
			NodeList children = root.getChildNodes();

			for (int layoutIndex = 0; layoutIndex < children.getLength(); layoutIndex++) {
				Node node = children.item(layoutIndex);
				if (node.getNodeType() != Node.ELEMENT_NODE)
					continue;

				switch (node.getNodeName()) {
//            추후 추가
//            case "Title":
//               
//               break;
				case "DataSources":
					NodeList datasourceNodes = node.getChildNodes();
					for (int datasourceIndex = 0; datasourceIndex < datasourceNodes.getLength(); datasourceIndex++) {
						Node datasourceNode = datasourceNodes.item(datasourceIndex);
						if (datasourceNode.getNodeType() != Node.ELEMENT_NODE)
							continue;
						String componentName = datasourceNode.getAttributes().getNamedItem("ComponentName")
								.getTextContent();
						String Name = datasourceNode.getAttributes().getNamedItem("Name").getTextContent();
						HashMap<String, Object> dataSourceInfo = new HashMap<>();
						dataSourceInfo.put("dataSource", componentName);
						this.dsNmWithInfo.put(Name, dataSourceInfo);
					}
					break;
				case "Items":
					itemsParser(node);
					break;
				case "LayoutTree":
					layoutRecursionParser(node, null, (LayoutTabWrapperVO) layoutWrapper,
							(List<Map<String, Object>>) this.item.get("items"));
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
						DataFieldType type = DataFieldType.fromString(fieldObject.getString("TYPE")).get();
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

				this.dsNmWithInfo.get(datasetNm).put("dsId", datasrcId);
				this.dsNmWithInfo.get(datasetNm).put("dsType", datasrcType);

				dataset.put("dataSrcId", datasrcId);
				dataset.put("datasetNm", datasetNm);
				dataset.put("datasetQuery", datasetQuery);
				dataset.put("datasetType", datasrcType);
				dataset.put("datasetId", this.dsNmWithInfo.get(datasetNm).get("dataSource"));
				dataset.put("fields", fields);
				datasets.add(dataset);
			}

			this.dataset.put("selectedDatasetId", this.dsNmWithInfo.values().iterator().next().get("dataSource"));
			this.dataset.put("datasetQuantity", this.datasetJsonArray.length());
			this.dataset.put("datasets", datasets);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 
	 * @param layoutNode xml Node
	 * @param parent     상위 Layout
	 * @param allLayouts total Layout
	 * @param items      items
	 */
	private void layoutRecursionParser(Node layoutNode, LayoutTabWrapperVO parent, LayoutTabWrapperVO allLayouts,
			List<Map<String, Object>> items) {

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
				for (int i = 0; i < items.size(); i++) {
					if (items.get(i).get("id").equals(id)) {
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

			List<Map<String, Object>> fields = new ArrayList<>();
			List<Map<String, Object>> dimensions = new ArrayList<>();
			List<Map<String, Object>> measures = new ArrayList<>();
			List<Map<String, Object>> dimensionGroups = new ArrayList<>();
			List<Map<String, Object>> sortByItem = new ArrayList<>();
			HashMap<String, String> dataItemMapper = new HashMap<>();

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
						dataFieldParser(datas, dataItemMapper, dimensions, measures);
					} else if ("HiddenMeasures".equals(itemChild.getNodeName())) {
						measures = hiddenMeasuresParser(itemChild, measures, sortByItem);
					} else if ("SeriesDimensions".equals(itemChild.getNodeName())) {
						dimensions = seriesDimensionParser(itemChild, dimensions, dimensionGroups, dataItemMapper);
					}
				}
				dataField.put("datasetId", datasetId);
				dataField.put("dimension", dimensions);
				dataField.put("measure", measures);
				dataField.put("dataFieldQuantity", dataFieldQuantity);
				dataField.put("dimensionGroup", dimensionGroups);
				dataField.put("sortByItem", sortByItem);

			} else if (ItemType.DATA_GRID.toString().equals(itemType)) {
				type = ItemType.DATA_GRID;
				NodeList itemChildren = node.getChildNodes();

				for (int itemChildrenIndex = 0; itemChildrenIndex < itemChildren.getLength(); itemChildrenIndex++) {
					if (itemChildren.item(itemChildrenIndex).getNodeType() != Node.ELEMENT_NODE)
						continue;

					Node itemChild = itemChildren.item(itemChildrenIndex);
					if ("DataItems".equals(itemChild.getNodeName())) {
						NodeList datas = itemChild.getChildNodes();
						dataFieldParser(datas, dataItemMapper, dimensions, measures);
					} else if ("HiddenMeasures".equals(itemChild.getNodeName())) {
						measures = hiddenMeasuresParser(itemChild, measures, sortByItem);
					}
				}
				fields.addAll(dimensions);
				fields.addAll(measures);
				
				dataField.put("datasetId", datasetId);
				dataField.put("field", fields);
				dataField.put("sparkline", new ArrayList<String>());
				dataField.put("sortByItem", sortByItem);
			} else if (ItemType.PIVOT_GRID.toString().equals(itemType)) {
				type = ItemType.PIVOT_GRID;
				NodeList itemChildren = node.getChildNodes();

				Map<String, String> rowNCol = new HashMap<>();

				for (int itemChildrenIndex = 0; itemChildrenIndex < itemChildren.getLength(); itemChildrenIndex++) {
					if (itemChildren.item(itemChildrenIndex).getNodeType() != Node.ELEMENT_NODE)
						continue;

					Node itemChild = itemChildren.item(itemChildrenIndex);
					if ("DataItems".equals(itemChild.getNodeName())) {
						NodeList datas = itemChild.getChildNodes();

						dataFieldParser(datas, dataItemMapper, dimensions, measures);
					} else if ("Columns".equals(itemChild.getNodeName())) {
						NodeList columnNodes = itemChild.getChildNodes();
						for (int columnNodesIndex = 0; columnNodesIndex < columnNodes.getLength(); columnNodesIndex++) {
							if (columnNodes.item(columnNodesIndex).getNodeType() != Node.ELEMENT_NODE)
								continue;
							String colUniNm = columnNodes.item(columnNodesIndex).getAttributes()
									.getNamedItem("UniqueName").getTextContent();
							rowNCol.put(colUniNm, "col");
						}
					} else if ("Rows".equals(itemChild.getNodeName())) {
						NodeList rowNodes = itemChild.getChildNodes();
						for (int rowNodesIndex = 0; rowNodesIndex < rowNodes.getLength(); rowNodesIndex++) {
							if (rowNodes.item(rowNodesIndex).getNodeType() != Node.ELEMENT_NODE)
								continue;
							String rowUniNm = rowNodes.item(rowNodesIndex).getAttributes().getNamedItem("UniqueName")
									.getTextContent();
							rowNCol.put(rowUniNm, "row");
						}
					} else if ("HiddenMeasures".equals(itemChild.getNodeName())) {
						measures = hiddenMeasuresParser(itemChild, measures, sortByItem);
					}
				}

				fields.addAll(dimensions);
				fields.addAll(measures);
				
				List<Object> measure = new ArrayList<>();
				List<Object> column = new ArrayList<>();
				List<Object> row = new ArrayList<>();

				for (int fieldsIndex = 0; fieldsIndex < fields.size(); fieldsIndex++) {
					HashMap<String, Object> field = (HashMap<String, Object>) fields.get(fieldsIndex);
					field.replace("sortBy", dataItemMapper.get(field.get("sortBy")));
					if ("dimension".equalsIgnoreCase((String) field.get("category"))) {
						String pivotType = rowNCol.get(field.get("fieldId"));
						if (pivotType.equals("col")) {
							column.add(field);
						} else if (pivotType.equals("row")) {
							row.add(field);
						}
					} else if ("measure".equalsIgnoreCase((String) field.get("category"))) {
						measure.add(field);
					}
				}

				dataField.put("row", row);
				dataField.put("column", column);
				dataField.put("measure", measure);
				dataField.put("dataFieldQuantity", fields.size());
				dataField.put("datasetId", datasetId);
				dataField.put("sortByItem", sortByItem);

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
	
	/**
	 * @param datas
	 * @param dataItemMapper
	 * @param dimensions
	 * @param measures
	 */
	private void dataFieldParser(NodeList datas, HashMap<String, String> dataItemMapper, 
			List<Map<String, Object>> dimensions, List<Map<String, Object>> measures) {
		for (int datasIndex = 0; datasIndex < datas.getLength(); datasIndex++) {
			if (datas.item(datasIndex).getNodeType() != Node.ELEMENT_NODE)
				continue;

			Node data = datas.item(datasIndex);

			if (DataFieldType.DIM.toString().equals(data.getNodeName().toLowerCase())) {
				NamedNodeMap dimensionNodes = data.getAttributes();

				String caption = Optional.ofNullable(dimensionNodes.getNamedItem("Name")).map(Node::getTextContent)
						.orElseGet(() -> dimensionNodes.getNamedItem("DataMember").getTextContent());
				String dimName = dimensionNodes.getNamedItem("DataMember").getTextContent();
				String fieldId = dimensionNodes.getNamedItem("UniqueName").getTextContent();
				String sortBy = null;
				Node sortByNode = dimensionNodes.getNamedItem("SortByMeasure");
				if (sortByNode == null || "".equals(sortByNode.getTextContent())) {
					sortBy = fieldId;
				} else {
					sortBy = sortByNode.getTextContent();
				}

				HashMap<String, Object> dimension = new HashMap<>();
				dimension.put("caption", caption);
				dimension.put("category", "dimension");
				dimension.put("fieldId", fieldId);
				dimension.put("name", dimName);
				dimension.put("uniqueName", dimName);
				dimension.put("sortBy", sortBy);
				dimension.put("sortOrder", "ASC");
				dimension.put("fieldType", "DIM");
				dimension.put("type", "DIMENSION");

				dataItemMapper.put(fieldId, dimName);

				dimensions.add(dimension);

			} else if (DataFieldType.MEA.toString().equals(data.getNodeName().toLowerCase())) {
				NamedNodeMap measureNodes = data.getAttributes();

				String caption = Optional.ofNullable(measureNodes.getNamedItem("Name")).map(Node::getTextContent)
						.orElseGet(() -> measureNodes.getNamedItem("DataMember").getTextContent());
				SummaryType summaryType = SummaryType
						.fromString(measureNodes.getNamedItem("SummaryType").getTextContent().toUpperCase()).get();
				String meaName = measureNodes.getNamedItem("DataMember").getTextContent();
				String fieldId = measureNodes.getNamedItem("UniqueName").getTextContent();

				HashMap<String, Object> measure = new HashMap<>();
				measure.put("caption", caption);
				measure.put("category", "measure");
				measure.put("fieldId", fieldId);
				measure.put("name", meaName);
				measure.put("uniqueName", meaName);
				measure.put("summaryType", summaryType);
				measure.put("sortBy", fieldId);
				measure.put("sortOrder", "ASC");
				measure.put("type", "MEASURE");
				measure.put("fieldType", "MEA");

				dataItemMapper.put(fieldId, meaName);

				measures.add(measure);

			}
		}
	}
	
	/**
	 * @param itemChild
	 * @param measures
	 * @param sortByItem
	 * @return measures
	 */
	private List<Map<String, Object>> hiddenMeasuresParser(Node itemChild, List<Map<String, Object>> measures, 
			List<Map<String, Object>> sortByItem) {
		NodeList hiddenMeaChildren = itemChild.getChildNodes();
		int hiddenMealength = hiddenMeaChildren.getLength();

		for (int hiddenMeaIndex = 0; hiddenMeaIndex < hiddenMealength; hiddenMeaIndex++) {
			if (hiddenMeaChildren.item(hiddenMeaIndex).getNodeType() != Node.ELEMENT_NODE)
				continue;

			NamedNodeMap hiddenMeaAttr = hiddenMeaChildren.item(hiddenMeaIndex).getAttributes();
			String hiddenMeaDataItem = hiddenMeaAttr.getNamedItem("UniqueName").getTextContent();

			measures = measures.stream().filter((measure) -> {
				if (measure.get("fieldId").equals(hiddenMeaDataItem)) {
					measure.put("category", "sortByItem");
					measure.replace("fieldType", "DIM");
					sortByItem.add(measure);
					return false;
				}
				return true;
			}).collect(Collectors.toList());
		}
		
		return measures;
	}
	
	/**
	 * 
	 * @param itemChild
	 * @param dimensions
	 * @param dimensionGroups
	 * @param dataItemMapper
	 * @return dimensions
	 */
	private List<Map<String, Object>> seriesDimensionParser(Node itemChild, List<Map<String, Object>> dimensions, 
			List<Map<String, Object>> dimensionGroups, HashMap<String, String> dataItemMapper) {
		NodeList seriesDimChildren = itemChild.getChildNodes();
		int seriesDimlength = seriesDimChildren.getLength();
	
		for (int seriesDimIndex = 0; seriesDimIndex < seriesDimlength; seriesDimIndex++) {
			if (seriesDimChildren.item(seriesDimIndex).getNodeType() != Node.ELEMENT_NODE)
				continue;
	
			NamedNodeMap seriesDimAttr = seriesDimChildren.item(seriesDimIndex).getAttributes();
			String dimGrpDataItem = seriesDimAttr.getNamedItem("UniqueName").getTextContent();
			final HashMap<String, String> finalDataItemMapper = dataItemMapper;
	
			dimensions = dimensions.stream().filter((dimension) -> {
				dimension.replace("sortBy", finalDataItemMapper.get(dimension.get("sortBy")));
				if (dimension.get("fieldId").equals(dimGrpDataItem)) {
					dimension.put("category", "dimensionGroup");
					dimensionGroups.add(dimension);
					return false;
				}
				return true;
			}).collect(Collectors.toList());
		}
		
		return dimensions;
	}
	@Override
	public Map<String, Object> getReport(ReportMstrDTO dto, String userId) throws Exception {
		this.getlayoutXmlDTO(dto.getLayoutXml());
		this.getDatasetXmlDTO(dto.getDatasetXml(), userId);
		this.getChartXmlDTO(dto.getChartXml());
		this.getReportXmlDTO(dto.getReportXml());
		this.getParamXmlDTO(dto.getParamXml());

		this.returnReport.put("dataset", this.dataset);
		this.returnReport.put("item", this.item);
		this.returnReport.put("layout", this.layout);
		this.returnReport.put("informations", this.informations);
		return returnReport;
	}
}