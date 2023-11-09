package com.wise.MarketingPlatForm.global.util;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import com.wise.MarketingPlatForm.dataset.domain.cube.vo.CubeInfoDTO;
import com.wise.MarketingPlatForm.dataset.service.CubeService;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.type.DataFieldType;
import com.wise.MarketingPlatForm.dataset.type.DataSetType;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.dataset.vo.CubeFieldVO;
import com.wise.MarketingPlatForm.dataset.vo.QueryFieldVO;
import com.wise.MarketingPlatForm.dataset.vo.RootFieldVO;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.RootData;
import com.wise.MarketingPlatForm.report.domain.data.data.SparkLine;
import com.wise.MarketingPlatForm.report.type.ItemType;
import com.wise.MarketingPlatForm.report.type.SummaryType;
import com.wise.MarketingPlatForm.report.vo.ChartFieldVO;
import com.wise.MarketingPlatForm.report.vo.CubeDatasetVO;
import com.wise.MarketingPlatForm.report.vo.DataGridFieldVO;
import com.wise.MarketingPlatForm.report.vo.DatasetXmlDTO;
import com.wise.MarketingPlatForm.report.vo.ItemMetaVO;
import com.wise.MarketingPlatForm.report.vo.ItemWrapperVO;
import com.wise.MarketingPlatForm.report.vo.ItemsVO;
import com.wise.MarketingPlatForm.report.vo.LayoutConfigVO;
import com.wise.MarketingPlatForm.report.vo.LayoutTabVO;
import com.wise.MarketingPlatForm.report.vo.LayoutTabWrapperVO;
import com.wise.MarketingPlatForm.report.vo.QueryDatasetVO;
import com.wise.MarketingPlatForm.report.vo.ReportMetaDTO;
import com.wise.MarketingPlatForm.report.vo.RootDataSetVO;
import com.wise.MarketingPlatForm.report.vo.RootItemFieldVO;


@Component
public class XMLParser {
	
	private final DocumentBuilderFactory factory;
	private final CubeService cubeService;
	private Map<String, String> datasources = new HashMap<String, String>();
	
	XMLParser (CubeService cubeService) {
		this.cubeService = cubeService;
		this.factory = DocumentBuilderFactory.newInstance();
	}
	
	@Autowired
	DatasetService datasetService;

	public List<RootDataSetVO> datasetParser(String xml, String userId) {
		List<RootDataSetVO> datasetVOList = new ArrayList<RootDataSetVO>();

		try {
			DocumentBuilder builder = factory.newDocumentBuilder(); 
			Document document = builder.parse(new InputSource(new StringReader(xml)));
			// DATASET_XML
			Element root = document.getDocumentElement();
			NodeList children = root.getChildNodes();
			
			for(int datasetElementIndex = 0; datasetElementIndex < children.getLength(); datasetElementIndex++) {
				if(children.item(datasetElementIndex).getNodeType() != Node.ELEMENT_NODE) continue;
				// DATASET_ELEMENT
				NodeList datasets = children.item(datasetElementIndex).getChildNodes();
				for(int datasetIndex = 0; datasetIndex < datasets.getLength(); datasetIndex++) {
					if(datasets.item(datasetIndex).getNodeType() != Node.ELEMENT_NODE) continue;
					// DATASET
					NodeList nodes = datasets.item(datasetIndex).getChildNodes();
					DatasetXmlDTO datasetXmlDTO = new DatasetXmlDTO();
					
					for(int nodesIndex = 0; nodesIndex < nodes.getLength(); nodesIndex++) {
						if(nodes.item(nodesIndex).getNodeType() != Node.ELEMENT_NODE) continue;
					
						Node node = nodes.item(nodesIndex);
						switch (node.getNodeName()) {
						case "DATASET_SEQ":
							datasetXmlDTO.setDatasetSeq(node.getTextContent());
							break;
						case "DATASET_NM":
							datasetXmlDTO.setDatasetNm(node.getTextContent());
							break;
						case "DATASRC_ID":
							datasetXmlDTO.setDataSrcId(Integer.parseInt(node.getTextContent()));
							break;
						case "DATASRC_TYPE":
							datasetXmlDTO.setDatasrcType(DsType.fromString(node.getTextContent()).get());
							break;
						case "DATASET_TYPE":
							datasetXmlDTO.setDatasetType(DataSetType.fromString(node.getTextContent()).get());
							break;
						case "DATASET_FIELD":
							NodeList fieldNodes = node.getChildNodes();
							List<RootFieldVO> fields = new ArrayList<RootFieldVO>();
							
							for(int fieldIndex = 0; fieldIndex < fieldNodes.getLength(); fieldIndex++) {
								if(fieldNodes.item(fieldIndex).getNodeType() != Node.ELEMENT_NODE) continue;
							
								Node fieldNode = fieldNodes.item(fieldIndex);
								NamedNodeMap field = fieldNode.getAttributes();
								RootFieldVO vo = null;
								
								String dataType = Optional.ofNullable(field.getNamedItem("DATA_TYPE"))
								        .map(Node::getTextContent)
								        .orElse(null);
								String name = field.getNamedItem("CAPTION").getTextContent();
								String icon = Optional.ofNullable(field.getNamedItem("icon"))
										.map(Node::getTextContent)
								        .orElse(null);
								String uniqueName = Optional.ofNullable(field.getNamedItem("UNI_NM"))
										.map(Node::getTextContent)
								        .orElse(null);
								String parentId = Optional.ofNullable(field.getNamedItem("PARENT_ID"))
										.map(Node::getTextContent)
								        .orElse(null);
								int order = Integer.parseInt(field.getNamedItem("ORDER").getTextContent());
								DataFieldType type = "MEA".equals(field.getNamedItem("TYPE").getTextContent())
										? DataFieldType.MEASURE : DataFieldType.DIMENSION;
								
								if(datasetXmlDTO.getDatasrcType().equals(DsType.CUBE)) {
									vo = CubeFieldVO.builder()
											.dataType(dataType)
											.name(name)
											.type(type)
											.uniqueName(uniqueName)
											.parentId(parentId)
											.order(order)
											.build();
									
								} else if(datasetXmlDTO.getDatasrcType().equals(DsType.DS_SQL)) {
									vo = QueryFieldVO.builder()
											.dataType(dataType)
											.name(name)
											.type(type)
											.uniqueName(uniqueName)
											.parentId(parentId)
											.build();
								}
								
								fields.add(vo);
							}
							datasetXmlDTO.setDatasetField(fields);
							break;
	//					추후 필요하면 추가
	//					case "DATASET_XML":
	//						datasetXmlDTO.setDatasetXml(node.getTextContent());
	//						break;
						case "DATASET_QUERY":
							datasetXmlDTO.setDatasetQuery(node.getTextContent());
							break;
						}
					}
					
					if(datasetXmlDTO.getDatasetField() == null) {
						List<RootFieldVO> fields = null;
						if(datasetXmlDTO.getDatasrcType().equals(DsType.CUBE)) {
							CubeInfoDTO cubeInfoDTO = cubeService.getCube(datasetXmlDTO.getDataSrcId().toString(), userId);
							fields = cubeInfoDTO.getFields();
						} else if(datasetXmlDTO.getDatasrcType().equals(DsType.DS_SQL)) {
							fields = datasetService.queryTableSql(datasetXmlDTO.getDataSrcId(), datasetXmlDTO.getDatasetQuery(), false);
						}
						datasetXmlDTO.setDatasetField(fields);
					}
					
					RootDataSetVO datasetVO = null;
					if(datasetXmlDTO.getDatasrcType().equals(DsType.CUBE)) {
						datasetVO = CubeDatasetVO.builder()
							.datasetId(datasources.get(datasetXmlDTO.getDatasetNm()))
							.datasetNm(datasetXmlDTO.getDatasetNm())
							.datasetType(datasetXmlDTO.getDatasrcType())
							.fields(datasetXmlDTO.getDatasetField())
							.cubeId(datasetXmlDTO.getDataSrcId())
							.cubeNm(datasetXmlDTO.getDatasetNm())
	//						.cubeDesc(cubeDesc)
	//						.dsViewId(cubeDesc)
	//						.ordinal(cubeDesc)
							.build();
					} else if(datasetXmlDTO.getDatasrcType().equals(DsType.DS_SQL)) {
						datasetVO = QueryDatasetVO.builder()
							.datasetId(datasources.get(datasetXmlDTO.getDatasetNm()))
							.datasetNm(datasetXmlDTO.getDatasetNm())
							.datasetType(datasetXmlDTO.getDatasrcType())
							.fields(datasetXmlDTO.getDatasetField())
							.dataSrcId(datasetXmlDTO.getDataSrcId())
							.datasetQuery(datasetXmlDTO.getDatasetQuery())
							.build();
					}
					datasetVOList.add(datasetVO);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			datasources = new HashMap<String, String>();
		}
		return datasetVOList;
	}
	
	public ReportMetaDTO layoutParser(int reportId, ReportMetaDTO reportMetaDTO, String xml) {
		Document document;
		
		LayoutTabWrapperVO layoutWrapper = LayoutTabWrapperVO.builder()
				.type("row")
				.weight((double) 100)
				.build();
		
		LayoutConfigVO resultLayoutConfigVO =  LayoutConfigVO.builder()
				.layout(layoutWrapper)
				.build();
		
		xml = xml.trim();
		
		try {
			DocumentBuilder builder = factory.newDocumentBuilder(); 
			document = builder.parse(new InputSource(new StringReader(xml)));
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
						datasources.put(Name, componentName);
					}
					break;
				case "Items":
					ItemWrapperVO itemWrapper = itemsParser(node);
					reportMetaDTO.setItem(itemWrapper);
					break;
				case "LayoutTree":
					layoutRecursionParser(node, null, resultLayoutConfigVO, reportMetaDTO.getItem().getItems());
					reportMetaDTO.getLayout().setLayoutConfig(resultLayoutConfigVO);
					break;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} 
		
		return reportMetaDTO;
	}
	
	private LayoutConfigVO layoutRecursionParser(Node layoutNode, LayoutTabWrapperVO parent, LayoutConfigVO resultLayoutConfigVO, List<ItemsVO> items) {
		
		NodeList children = layoutNode.getChildNodes();
		for(int layoutIndex = 0; layoutIndex < children.getLength(); layoutIndex++) {
			if(children.item(layoutIndex).getNodeType() != Node.ELEMENT_NODE) continue;

			Node node = children.item(layoutIndex);
			Double weight;
			
			switch (node.getNodeName()) {
			case "LayoutGroup":
				weight = Double.parseDouble(Optional.ofNullable(node.getAttributes().getNamedItem("Weight"))
				        .map(Node::getTextContent)
				        .orElse(null));
				
				LayoutTabWrapperVO layoutWrapper = LayoutTabWrapperVO.builder()
					.type("row")
					.weight(weight)
					.build();
				
				if(parent == null) {
					LayoutTabWrapperVO rootNode = (LayoutTabWrapperVO) resultLayoutConfigVO.getLayout();
					rootNode.getChildren().add(layoutWrapper);
				} else {
					parent.getChildren().add(layoutWrapper);
				}
				
				layoutRecursionParser(node, layoutWrapper, resultLayoutConfigVO, items);
				break;
			case "LayoutItem":
				
				weight = Double.parseDouble(Optional.ofNullable(node.getAttributes().getNamedItem("Weight"))
				        .map(Node::getTextContent)
				        .orElse(null));
				String id = Optional.ofNullable(node.getAttributes().getNamedItem("DashboardItem"))
						.map(Node::getTextContent)
						.orElse(null);
				
				String component = items.stream()
				    .filter(item -> item.getId().equals(id))
				    .map(item -> item.getType().toString())
				    .findFirst()
				    .orElse(null);
				
				String name =  items.stream()
					    .filter(item -> item.getId().equals(id))
					    .map(item -> item.getMeta().getName())
					    .findFirst()
					    .orElse(null);
				
				LayoutTabVO tab = LayoutTabVO.builder()
						.component(component)
						.id(id)
						.name(name)
						.type("tab")
						.build();
				
				LayoutTabWrapperVO layoutTabset = LayoutTabWrapperVO.builder()
					.type("tabset")
					.weight(weight)
					.build();
				
				layoutTabset.getChildren().add(tab);
				
				if(parent == null) {
					LayoutTabWrapperVO rootNode = (LayoutTabWrapperVO) resultLayoutConfigVO.getLayout();
					rootNode.getChildren().add(layoutTabset);
				} else {
					parent.getChildren().add(layoutTabset);
				}
				break;
//			추후 추가
//			case "LayoutTabContainer":
//				break;
//			case "LayoutTabPage":
//				break;
			}
		}
		return resultLayoutConfigVO;
	}
	
	private ItemWrapperVO itemsParser(Node itemsNode) {
		NodeList children = itemsNode.getChildNodes();
		List<ItemsVO> itemsList = new ArrayList<ItemsVO>();
		
		for(int itemsIndex = 0; itemsIndex < children.getLength(); itemsIndex++) {
			if(children.item(itemsIndex).getNodeType() != Node.ELEMENT_NODE) continue;

			Node node = children.item(itemsIndex);
			
			String itemType = node.getNodeName().toLowerCase();
			ItemType type = null;
			String componentName = node.getAttributes().getNamedItem("ComponentName").getTextContent();
			String datasetId = node.getAttributes().getNamedItem("DataSource").getTextContent();
			String name = node.getAttributes().getNamedItem("Name").getTextContent();
			String memo = Optional.ofNullable(node.getAttributes().getNamedItem("MemoText"))
					.map(Node::getTextContent)
					.orElse(null);
			RootItemFieldVO dataField = null;
			int dataFieldQuantity = 0;
			
			if(ItemType.CHART.toString().equals(itemType)) {
				type = ItemType.CHART;
				NodeList itemChildren = node.getChildNodes();
				List<Dimension> dimensions = new ArrayList<Dimension>();
				List<Measure> measures = new ArrayList<Measure>();
				
				for(int itemChildrenIndex = 0; itemChildrenIndex < itemChildren.getLength(); itemChildrenIndex++) {
					if(itemChildren.item(itemChildrenIndex).getNodeType() != Node.ELEMENT_NODE) continue;
					dataFieldQuantity++;
					
					Node itemChild = itemChildren.item(itemChildrenIndex);
					if("DataItems".equals(itemChild.getNodeName())) {
						NodeList datas = itemChild.getChildNodes();
						
						for(int datasIndex = 0; datasIndex < datas.getLength(); datasIndex++) {
							if(datas.item(datasIndex).getNodeType() != Node.ELEMENT_NODE) continue;
							
							Node data = datas.item(datasIndex);
							if(DataFieldType.DIMENSION.toString().equals(data.getNodeName().toLowerCase())) {
								NamedNodeMap dimensionNodes = data.getAttributes();
								
								String caption = Optional.ofNullable(dimensionNodes.getNamedItem("Name"))
										.map(Node::getTextContent)
										.orElseGet(() -> dimensionNodes.getNamedItem("DataMember").getTextContent());
								String dimName = dimensionNodes.getNamedItem("DataMember").getTextContent();
								String fieldId = dimensionNodes.getNamedItem("UniqueName").getTextContent();
								
								Dimension dimensoion = Dimension.builder()
										.caption(caption)
										.category(DataFieldType.DIMENSION.toString())
										.fieldId(fieldId)
										.name(dimName)
										.uniqueName(dimName)
										.build();
								
								dimensions.add(dimensoion);
								
							} else if(DataFieldType.MEASURE.toString().equals(data.getNodeName().toLowerCase())) {
								NamedNodeMap measureNodes = data.getAttributes();
								
								String caption = Optional.ofNullable(measureNodes.getNamedItem("Name"))
										.map(Node::getTextContent)
										.orElseGet(() -> measureNodes.getNamedItem("DataMember").getTextContent());
								SummaryType summaryType = SummaryType.fromString(
										measureNodes.getNamedItem("SummaryType").getTextContent().toUpperCase()).get();
								String meaName = measureNodes.getNamedItem("DataMember").getTextContent();
								String fieldId = measureNodes.getNamedItem("UniqueName").getTextContent();
								
								Measure measure = Measure.builder()
										.caption(caption)
										.category(DataFieldType.MEASURE.toString())
										.fieldId(fieldId)
										.name(meaName)
										.uniqueName(meaName)
										.summaryType(summaryType)
										.build();
								
								measures.add(measure);
							}
						}
					}
				}
				dataField = ChartFieldVO.builder()
						.datasetId(datasetId)
						.dimension(dimensions)
						.measure(measures)
						.dataFieldQuantity(dataFieldQuantity)
						.build();	
				
			} else if (ItemType.DATA_GRID.toString().equals(itemType)) {
				type = ItemType.DATA_GRID;
				NodeList itemChildren = node.getChildNodes();
				List<RootData> fields = new ArrayList<RootData>();
				List<SparkLine> sparklines = new ArrayList<SparkLine>();
				
				for(int itemChildrenIndex = 0; itemChildrenIndex < itemChildren.getLength(); itemChildrenIndex++) {
					if(itemChildren.item(itemChildrenIndex).getNodeType() != Node.ELEMENT_NODE) continue;

					Node itemChild = itemChildren.item(itemChildrenIndex);
					if("DataItems".equals(itemChild.getNodeName())) {
						NodeList datas = itemChild.getChildNodes();
						
						for(int datasIndex = 0; datasIndex < datas.getLength(); datasIndex++) {
							if(datas.item(datasIndex).getNodeType() != Node.ELEMENT_NODE) continue;
							
							Node data = datas.item(datasIndex);
							if(DataFieldType.DIMENSION.toString().equals(data.getNodeName().toLowerCase())) {
								NamedNodeMap dimensionNodes = data.getAttributes();
								String caption = Optional.ofNullable(dimensionNodes.getNamedItem("Name"))
										.map(Node::getTextContent)
										.orElseGet(() -> dimensionNodes.getNamedItem("DataMember").getTextContent());
								String dimName = dimensionNodes.getNamedItem("DataMember").getTextContent();
								String fieldId = dimensionNodes.getNamedItem("UniqueName").getTextContent();
								DataFieldType dataType = DataFieldType.DIMENSION;
										
								Dimension dimensoion = Dimension.builder()
										.caption(caption)
										.category(DataFieldType.FIELD.toString())
										.fieldId(fieldId)
										.name(dimName)
										.type(dataType)
										.uniqueName(dimName)
										.build();
								
								fields.add(dimensoion);
							} else if(DataFieldType.MEASURE.toString().equals(data.getNodeName().toLowerCase())) {
								NamedNodeMap measureNodes = data.getAttributes();
								
								String caption = Optional.ofNullable(measureNodes.getNamedItem("Name"))
										.map(Node::getTextContent)
										.orElseGet(() -> measureNodes.getNamedItem("DataMember").getTextContent());
								SummaryType summaryType = SummaryType.fromString(
										measureNodes.getNamedItem("SummaryType").getTextContent().toUpperCase()).get();
								String meaName = measureNodes.getNamedItem("DataMember").getTextContent();
								String fieldId = measureNodes.getNamedItem("UniqueName").getTextContent();
								DataFieldType dataType = DataFieldType.MEASURE;
								
								Measure measure = Measure.builder()
										.caption(caption)
										.category(DataFieldType.MEASURE.toString())
										.fieldId(fieldId)
										.name(meaName)
										.type(dataType)
										.uniqueName(meaName)
										.summaryType(summaryType)
										.build();
								fields.add(measure);
							} 
//							else if(sparkLine 추후 추가)
							dataField = DataGridFieldVO.builder()
									.datasetId(datasetId)
									.field(fields)
									.sparkline(new ArrayList<SparkLine>())
									.build();	
							
						}	
					}
					
				}
			}	
			
			ItemMetaVO meta = ItemMetaVO.builder()
					.dataField(dataField)
					.memo(memo)
					.name(name)
					.useCaption(name)
					.build();
			
			ItemsVO items = ItemsVO.builder()
					.id(componentName)
					.type(type.toString())
					.meta(meta)
					.build();
			itemsList.add(items);
		}
		
		ItemWrapperVO itemVO = ItemWrapperVO.builder()
			.itemQuantity(itemsList.size())
			.selectedItemId(itemsList.get(0).getId())
			.items(itemsList)
			.build();
		
		return itemVO;
	}
	
}
