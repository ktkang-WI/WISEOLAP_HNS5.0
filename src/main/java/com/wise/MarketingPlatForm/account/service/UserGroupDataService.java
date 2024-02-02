package com.wise.MarketingPlatForm.account.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.model.common.DataSetXmlModel;
import com.wise.MarketingPlatForm.utils.XMLParser;

@Service
public class UserGroupDataService {

  private Base64 base64 = new Base64();

  public DataSetXmlModel dataXmlParsing(String dataXml) throws Exception{
    Map<Integer,List<Integer>> cubeIdTemp = new HashMap<>();
    Map<Integer,List<String>> cubeDimNmTemp = new HashMap<>();
    List<Integer> dsViewIdTemp = new ArrayList<>();

    List<Integer> cubeId = new ArrayList<>();
    List<String> cubeDimId = new ArrayList<>();

    String decodedString = new String(base64.decode(dataXml.getBytes()),"UTF-8");
    XMLParser xmlParser = new XMLParser(decodedString);
    xmlParser.createDocument();

    xmlParser.setParentElement("Auth_Cubes");
    List<Map<String,Object>> auth_Cubes = xmlParser.getChildrenElement("DS_VIEW_ID","CUBE_ID");

    xmlParser.setParentElement("Auth_Dim");
    List<Map<String,Object>> auth_Dim = xmlParser.getChildrenElement("DS_VIEW_ID","DIM_UNI_NM");

    for (Map<String,Object> authCube : auth_Cubes) {
      int getDsViewId = Integer.parseInt(authCube.get("DS_VIEW_ID").toString());
      int getcubeId = Integer.parseInt(authCube.get("CUBE_ID").toString());

      if (!dsViewIdTemp.contains(getDsViewId)) {
        dsViewIdTemp.add(getDsViewId);
        cubeId = new ArrayList<>();
      }
      cubeId.add(getcubeId);
      cubeIdTemp.put(getDsViewId, cubeId);
    }

    for (Map<String,Object> authDim : auth_Dim) {
      int getDsViewId = Integer.parseInt(authDim.get("DS_VIEW_ID").toString());
      String getcubeDimNm = authDim.get("DIM_UNI_NM").toString();
      
      if (!dsViewIdTemp.contains(getDsViewId)) {
        dsViewIdTemp.add(getDsViewId);
        cubeDimId = new ArrayList<>();
      }

      cubeDimId.add(getcubeDimNm);
      cubeDimNmTemp.put(getDsViewId, cubeDimId);

    }

    DataSetXmlModel result = DataSetXmlModel.builder()
      .dsViewId(dsViewIdTemp)
      .cubeId(cubeIdTemp)
      .cubeDimNm(cubeDimNmTemp)
      .build();
    
    return result;
  }
}
