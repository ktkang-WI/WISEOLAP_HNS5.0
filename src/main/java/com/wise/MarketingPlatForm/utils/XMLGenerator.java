package com.wise.MarketingPlatForm.utils;

import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class XMLGenerator {
  
  private DocumentBuilderFactory factory = null;
	  private DocumentBuilder builder = null;
	  private Document document = null;
	  private Element rootElement = null;
	  private Map<String, Element> elements = new HashMap<>();

	  public XMLGenerator(String name) throws Exception{
	    factory = DocumentBuilderFactory.newInstance();
	    builder = factory.newDocumentBuilder();
	    document = builder.newDocument();
	    rootElement = document.createElement(name);
	    document.appendChild(rootElement);
	  }

	  public Element createElement(String name) {
	    Element tempElement = document.createElement(name);
	    rootElement.appendChild(tempElement);
	    elements.put(name, tempElement);
	    return tempElement;
	  }

	  public void createElement(String elementName, String name, Object content) {
		Element element = elements.get(elementName);
	    Element tempElement = document.createElement(name);
	    tempElement.setTextContent(String.valueOf(content));
	    element.appendChild(tempElement);
	  }

	  public String builder() throws TransformerException {
	    TransformerFactory transformerFactory = TransformerFactory.newInstance();
			Transformer transformer = transformerFactory.newTransformer();
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");

	    StringWriter writer = new StringWriter();
	    StreamResult result = new StreamResult(writer);
	    DOMSource source = new DOMSource(document);
	    transformer.transform(source, result);

	    String xmlString = writer.toString();

	    return xmlString;
	  }

}
