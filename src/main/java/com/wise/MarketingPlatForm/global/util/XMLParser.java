package com.wise.MarketingPlatForm.global.util;

import java.io.IOException;
import java.io.StringReader;
import java.util.stream.IntStream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.wise.MarketingPlatForm.report.vo.DatasetVO;

public final class XMLParser {
	private static DocumentBuilderFactory factory;
	private static DocumentBuilder builder; 
	
	private XMLParser () {
		try {
			this.factory = DocumentBuilderFactory.newInstance();
			this.builder = factory.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		}
	}
	
	public static DatasetVO cubeDatasetParser(String xml) {
		try {
			Document document = builder.parse(new InputSource(new StringReader(xml)));
			Element root = document.getDocumentElement();
			NodeList children = root.getChildNodes();
//			IntStream.range(0, children.getLength()).forEach((i) -> {
//				Node node = children.item(i);
//				if (node.getNodeType() != Node.ELEMENT_NODE) continue;
//				if (node.getNodeName().equals("Auth_Dim")) {
//					
//				}
//			});
		} catch (SAXException | IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static DatasetVO queryDatasetParser(String xml) {
		try {
			Document document = builder.parse(new InputSource(new StringReader(xml)));
			Element root = document.getDocumentElement();
			NodeList children = root.getChildNodes();
		} catch (SAXException | IOException e) {
			e.printStackTrace();
		}
		return null;
	}
}
