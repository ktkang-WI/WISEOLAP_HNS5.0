package com.wise.MarketingPlatForm.global.util;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import com.wise.MarketingPlatForm.dataset.domain.cube.vo.CubeInfoDTO;
import com.wise.MarketingPlatForm.dataset.service.CubeService;
import com.wise.MarketingPlatForm.dataset.type.DataFieldType;
import com.wise.MarketingPlatForm.dataset.type.DataSetType;
import com.wise.MarketingPlatForm.dataset.type.DsType;
import com.wise.MarketingPlatForm.dataset.vo.DatasetFieldVO;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.type.ItemType;
import com.wise.MarketingPlatForm.report.type.SummaryType;
import com.wise.MarketingPlatForm.report.vo.ChartFieldVO;
import com.wise.MarketingPlatForm.report.vo.CubeDatasetVO;
import com.wise.MarketingPlatForm.report.vo.DatasetXmlDTO;
import com.wise.MarketingPlatForm.report.vo.ItemMetaVO;
import com.wise.MarketingPlatForm.report.vo.ItemVO;
import com.wise.MarketingPlatForm.report.vo.ItemsVO;
import com.wise.MarketingPlatForm.report.vo.LayoutConfigVO;
import com.wise.MarketingPlatForm.report.vo.LayoutTabVO;
import com.wise.MarketingPlatForm.report.vo.LayoutTabWrapperVO;
import com.wise.MarketingPlatForm.report.vo.MetaVO;
import com.wise.MarketingPlatForm.report.vo.QueryDatasetVO;
import com.wise.MarketingPlatForm.report.vo.RootDataSetVO;
import com.wise.MarketingPlatForm.report.vo.RootFieldVO;

@Component
public class XMLParser {
	
	private final DocumentBuilderFactory factory;
	private final CubeService cubeService;
	
	XMLParser (CubeService cubeService) {
		this.cubeService = cubeService;
		this.factory = DocumentBuilderFactory.newInstance();
	}

	public List<RootDataSetVO> datasetParser(String xml, String userId) {
		List<RootDataSetVO> datasetVOList = new ArrayList<RootDataSetVO>();

		try {
			DocumentBuilder builder = factory.newDocumentBuilder(); 
			Document document = builder.parse(new InputSource(new StringReader(xml)));
			Element root = document.getDocumentElement();
			NodeList children = root.getChildNodes();
			
			for(int datasetIndex = 0; datasetIndex < children.getLength(); datasetIndex++) {
				if(children.item(datasetIndex).getNodeType() != Node.ELEMENT_NODE) continue;
				
				NodeList nodes = children.item(datasetIndex).getChildNodes().item(0).getChildNodes();
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
						datasetXmlDTO.setDatasrcId(Integer.parseInt(node.getTextContent()));
						break;
					case "DATASRC_TYPE":
						datasetXmlDTO.setDatasrcType(DsType.fromString(node.getTextContent()).get());
						break;
					case "DATASET_TYPE":
						datasetXmlDTO.setDatasetType(DataSetType.fromString(node.getTextContent()).get());
						break;
					case "DATASET_FIELD":
						NodeList fieldNodes = node.getChildNodes();
						List<DatasetFieldVO> fields = new ArrayList<DatasetFieldVO>();
						IntStream.range(0, fieldNodes.getLength()).forEach((fieldIndex) -> {
							Node fieldNode = fieldNodes.item(fieldIndex);
							NamedNodeMap field = fieldNode.getAttributes();
							
							String dataType = Optional.ofNullable(field.getNamedItem("DATA_TYPE"))
							        .map(Node::getTextContent)
							        .orElse(null);
							String name = field.getNamedItem("CAPTION").getTextContent();
							String icon = Optional.ofNullable(field.getNamedItem("icon"))
									.map(Node::getTextContent)
							        .orElse(null);
							DataFieldType type = Optional.ofNullable(field.getNamedItem("TYPE"))
									.map((i) ->
										"MEA".equals(i.getTextContent()) ? DataFieldType.MEASURE : DataFieldType.DIMENSION)
									.orElse(null);
							String uniqueName = Optional.ofNullable(field.getNamedItem("UNI_NM"))
									.map(Node::getTextContent)
							        .orElse(null);
							String parentId = Optional.ofNullable(field.getNamedItem("PARENT_ID"))
									.map(Node::getTextContent)
							        .orElse(null);
							int order = Integer.parseInt(field.getNamedItem("ORDER").getTextContent());
							
							DatasetFieldVO vo = DatasetFieldVO.builder()
								.dataType(dataType)
								.name(name)
								.type(type)
								.uniqueName(uniqueName)
								.parentId(parentId)
								.order(order)
								.build();
							
							fields.add(vo);
						});
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
				
				RootDataSetVO datasetVO = null;
				if(datasetXmlDTO.getDatasrcType().equals(DsType.CUBE)) {
					CubeInfoDTO cubeInfoDTO = cubeService.getCube(datasetXmlDTO.getDatasrcId().toString(), userId);
					List<DatasetFieldVO> fields = cubeInfoDTO.getFields();
					datasetVO = CubeDatasetVO.builder()
						.datasetId(datasetXmlDTO.getDatasrcId())
						.datasetNm(datasetXmlDTO.getDatasetNm())
						.datsetType(datasetXmlDTO.getDatasrcType())
						.fields(fields)
						.cubeId(datasetXmlDTO.getDatasrcId())
						.cubeNm(datasetXmlDTO.getDatasetNm())
//						.cubeDesc(cubeDesc)
//						.dsViewId(cubeDesc)
//						.ordinal(cubeDesc)
						.build();
				} else if(datasetXmlDTO.getDatasrcType().equals(DsType.DS_SQL)) {
					datasetVO = QueryDatasetVO.builder()
						.datasetId(datasetXmlDTO.getDatasrcId())
						.datasetNm(datasetXmlDTO.getDatasetNm())
						.datsetType(datasetXmlDTO.getDatasrcType())
						.fields(datasetXmlDTO.getDatasetField())
						.datasrcId(datasetXmlDTO.getDatasrcId())
						.datasetQuery(datasetXmlDTO.getDatasetQuery())
						.build();
				}
				datasetVOList.add(datasetVO);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return datasetVOList;
	}
	
	public MetaVO layoutParser(int reportId, MetaVO metaVO, String xml) {
		Document document;
		LayoutConfigVO resultLayoutConfigVO =  LayoutConfigVO.builder().build();
		xml = xml.trim();
		
		try {
			DocumentBuilder builder = factory.newDocumentBuilder(); 
			document = builder.parse(new InputSource(new StringReader(xml)));
			Element root = document.getDocumentElement();
			NodeList children = root.getChildNodes();
			
			for(int layoutIndex = 0; layoutIndex < children.getLength(); layoutIndex++) {
				if(children.item(layoutIndex).getNodeType() != Node.ELEMENT_NODE) continue;
				
				Node node = children.item(layoutIndex);
				switch (node.getNodeName()) {
//				추후 추가
//				case "Title":
//					
//					break;
				case "DataSources":
					
					break;
				case "Items":
					ItemVO item = itemsParser(node);
					metaVO.getItem().put(reportId, item);
					break;
				case "LayoutTree":
					layoutRecursionParser(node, null, resultLayoutConfigVO, metaVO.getItem().get(reportId).getItems());
					metaVO.getLayout().put(reportId, resultLayoutConfigVO);
					break;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} 
		
		return metaVO;
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
					resultLayoutConfigVO.getLayout().add(layoutWrapper);
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
					resultLayoutConfigVO.getLayout().add(layoutTabset);
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
	
	private ItemVO itemsParser(Node itemsNode) {
		NodeList children = itemsNode.getChildNodes();
		List<Dimension> dimensions = new ArrayList<Dimension>();
		List<Measure> measures = new ArrayList<Measure>();
		List<ItemsVO> itemsList = new ArrayList<ItemsVO>();
		
		for(int itemsIndex = 0; itemsIndex < children.getLength(); itemsIndex++) {
			if(children.item(itemsIndex).getNodeType() != Node.ELEMENT_NODE) continue;

			Node node = children.item(itemsIndex);
			
			String itemType = node.getNodeName().toLowerCase();
			ItemType type = null;
			String componentName =node.getAttributes().getNamedItem("ComponentName").getTextContent();
			String datasetId = node.getAttributes().getNamedItem("DataSource").getTextContent();
			String name = node.getAttributes().getNamedItem("Name").getTextContent();
			String memo = Optional.ofNullable(node.getAttributes().getNamedItem("MemoText"))
					.map(Node::getTextContent)
					.orElse(null);
			RootFieldVO dataField = null;
			
			if(ItemType.CHART.toString().equals(itemType)) {
				type = ItemType.CHART;
				NodeList itemChildren = node.getChildNodes();
				
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
								String uniqueName = Optional.ofNullable(dimensionNodes.getNamedItem("uniqueName"))
										.map(Node::getTextContent)
										.orElse(null);
								
								Dimension dimensoion = Dimension.builder()
										.caption(caption)
										.category(DataFieldType.DIMENSION.toString())
										.fieldId("")
										.name(dimName)
										.uniqueName(uniqueName)
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
								String uniqueName = Optional.ofNullable(measureNodes.getNamedItem("uniqueName"))
										.map(Node::getTextContent)
										.orElse(null);
								
								Measure measure = Measure.builder()
										.caption(caption)
										.category(DataFieldType.MEASURE.toString())
										.fieldId("")
										.name(meaName)
										.uniqueName(uniqueName)
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
						.build();				
			}
//				추후 아이템 추가시.
//				else if (ItemType.GRID.toString().equals(itemType)) {
//					
//				}
			
			ItemMetaVO meta = ItemMetaVO.builder()
					.dataField(dataField)
					.memo(memo)
					.name(name)
					.build();
			
			ItemsVO items = ItemsVO.builder()
					.id(componentName)
					.type(type.toString())
					.meta(meta)
					.build();
			itemsList.add(items);
		}
		
		ItemVO itemVO = ItemVO.builder()
			.items(itemsList)
			.build();
		
		return itemVO;
	}
	
}
