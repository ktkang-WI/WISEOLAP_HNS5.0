package com.wise.MarketingPlatForm.account.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dto.CubeDTO;
import com.wise.MarketingPlatForm.account.dto.DsViewDimDTO;
import com.wise.MarketingPlatForm.account.model.groups.data.DataModel;
import com.wise.MarketingPlatForm.utils.XMLParser;

@Service
public class UserGroupMeasureService {

  private Base64 base64 = new Base64();

  public List<DataModel> dataXmlParsing(String dataXml) throws Exception{
    List<DataModel> result = new ArrayList<>();
    String decodedString = new String(base64.decode(dataXml.getBytes()), "UTF-8");
    XMLParser xmlParser = new XMLParser(decodedString);
    xmlParser.createDocument();

    // Auth_Cubes 처리
    xmlParser.setParentElement("Auth_Meas");
    List<Map<String,Object>> auth_Cubes = xmlParser.getChildrenElement("DS_VIEW_ID","CUBE_ID"); // add CUBE_NM
    auth_Cubes.sort(Comparator.comparing(m -> Integer.parseInt(m.get("DS_VIEW_ID").toString())));

    // Auth_Dim 처리
    xmlParser.setParentElement("Auth_Dim");
    List<Map<String,Object>> auth_Dim = xmlParser.getChildrenElement("DS_VIEW_ID","DIM_UNI_NM");  // add CUBE_ID, CUBE_NM
    auth_Dim.sort(Comparator.comparing(m -> Integer.parseInt(m.get("DS_VIEW_ID").toString())));

    // 공통 DS_VIEW_ID 추출
    Set<String> dsViewIds = new HashSet<>();
    for (Map<String, Object> map : auth_Cubes) {
        String dvId = map.get("DS_VIEW_ID").toString();
        dsViewIds.add(dvId);
    }
    for (Map<String, Object> map : auth_Dim) {
        String dvId = map.get("DS_VIEW_ID").toString();
        dsViewIds.add(dvId);
    }

    // DataModel 생성
    for (String dsViewId : dsViewIds) {
        List<CubeDTO> cubeIds = new ArrayList<>();
        List<DsViewDimDTO> cubeDims = new ArrayList<>();

        // Auth_Cubes 처리
        Iterator<Map<String, Object>> cubeIterator = auth_Cubes.iterator();
        while (cubeIterator.hasNext()) {
            Map<String, Object> map = cubeIterator.next();
            int getdsViewId = Integer.parseInt(map.get("DS_VIEW_ID").toString());
            int getcubeId = Integer.parseInt(map.get("CUBE_ID").toString());
            if (map.containsKey("DS_VIEW_ID") && map.get("DS_VIEW_ID").equals(dsViewId)) {
                CubeDTO cube = CubeDTO.builder()
                    .dsViewId(getdsViewId)
                    .cubeId(getcubeId)
                    .build();
                cubeIds.add(cube);
                cubeIterator.remove();
            }
        }

        // Auth_Dim 처리
        Iterator<Map<String, Object>> dimIterator = auth_Dim.iterator();
        while (dimIterator.hasNext()) {
            Map<String, Object> map = dimIterator.next();
            int getdsViewId = Integer.parseInt(map.get("DS_VIEW_ID").toString());
            String getcubeDimNm = map.get("DIM_UNI_NM").toString();
            if (map.containsKey("DS_VIEW_ID") && map.get("DS_VIEW_ID").equals(dsViewId)) {
                DsViewDimDTO cubeDim = DsViewDimDTO.builder()
                    .dsViewId(getdsViewId)
                    .dimDimUniNm(getcubeDimNm)
                    .build();
                cubeDims.add(cubeDim);
                dimIterator.remove();
            }
        }

        DataModel dataModel = DataModel.builder()
                .dsViewId(Integer.parseInt(dsViewId))
                .cubeId(cubeIds)
                .dsViewDim(cubeDims)
                .build();
        result.add(dataModel);
    }

    return result;

  }

  
}
