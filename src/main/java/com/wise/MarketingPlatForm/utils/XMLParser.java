package com.wise.MarketingPlatForm.utils;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.*;
import org.xml.sax.InputSource;

// TODO: 임시용 소스
public class XMLParser {
  
  private DocumentBuilderFactory factory = null;
  private DocumentBuilder builder = null;
  private InputSource inputSource = null;
  private Document document = null;
  private NodeList list = null;

  public XMLParser(String dataXml) throws Exception{
    factory = DocumentBuilderFactory.newInstance();
    builder = factory.newDocumentBuilder();
    inputSource = new InputSource(new StringReader(dataXml));
  }

  public boolean createDocument() throws Exception{

    if (inputSource == null) throw new Exception("inputSource is not defined");
    
    document = builder.parse(inputSource);

    if (document == null) throw new Exception("document is not defined");

    return true;
  }

  public void setParentElement(String name) {
    list = document.getElementsByTagName(name);
  }

  public List<Map<String,Object>> getChildrenElement(String... names) {

    List<Map<String,Object>> result = new ArrayList<>();

    for (int i = 0; i < list.getLength(); i++) {
      Node node = list.item(i);
    
      if (node.getNodeType() == Node.ELEMENT_NODE) {
        Element eElement = (Element) node;

        Map<String,Object> temp = new HashMap<>();
        for (String name : names) {
          temp.put(name, eElement.getElementsByTagName(name).item(0).getTextContent());
        }
        result.add(temp);

      }
    }
    return result;
  }
}
