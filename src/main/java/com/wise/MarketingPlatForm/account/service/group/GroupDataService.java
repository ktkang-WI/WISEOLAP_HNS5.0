package com.wise.MarketingPlatForm.account.service.group;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDataDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDataPutDTO;
import com.wise.MarketingPlatForm.account.entity.GroupAuthDataMstrEntity;
import com.wise.MarketingPlatForm.account.model.groups.data.GroupDataModel;
import com.wise.MarketingPlatForm.account.service.UserGroupDataService;
import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeMstrEntity;
import com.wise.MarketingPlatForm.dataset.dto.ds.DataDsviewCubeDimDTO;
import com.wise.MarketingPlatForm.dataset.dto.ds.DatasetDsDsviewCubeDTO;
import com.wise.MarketingPlatForm.utils.XMLGenerator;

@Service
public class GroupDataService {

  @Autowired
  private AccountDAO accountDAO;
  @Autowired
  private UserGroupDataService UGDataService;

  private Base64 base64 = new Base64();

  public List<GroupDataModel> getGroupData() throws Exception{

    List<GroupDataDTO> userGroupDTO = accountDAO.selectGroupData();

    if (userGroupDTO == null) return null;

    List<GroupDataModel> groupDataModel = generateUserDataObject(userGroupDTO);

    return groupDataModel;
  }

  public boolean putGroupData(List<GroupDataPutDTO> groupDatasetPutDTO) throws Exception{

    List<GroupAuthDataMstrEntity> groupAuthDataMstr = generateGroupAuthDataObject(groupDatasetPutDTO);

    if (groupAuthDataMstr == null) return false;

    boolean result = false;
  
    result = accountDAO.deleteGroupData(groupAuthDataMstr);
    result = accountDAO.putGroupData(groupAuthDataMstr);

    return result;
  }

  private List<GroupAuthDataMstrEntity> generateGroupAuthDataObject(List<GroupDataPutDTO> groupDatasetPutDTO) throws Exception{
    List<GroupAuthDataMstrEntity> result = new ArrayList<>();
    String rootXML = "NewDataSet";
    String memXML = "Auth_Mem";
    String cubeXML = "Auth_Cubes";
    String dimXML = "Auth_Dim";

    for (GroupDataPutDTO groupDataPut : groupDatasetPutDTO) {
      XMLGenerator xmlGenerator = new XMLGenerator(rootXML);
      String XML = null;
      int grpId = groupDataPut.getGrpId();
      
      for (DatasetDsDsviewCubeDTO datasetDsDsviewCubeDTO : groupDataPut.getDsView()) {
        xmlGenerator.createElement(memXML);
        xmlGenerator.createElement(memXML, "DS_VIEW_ID", datasetDsDsviewCubeDTO.getDsViewId());
        xmlGenerator.createElement(memXML, "DIM_UNI_NM", "["+datasetDsDsviewCubeDTO.getDimUniNm()+"]");
        xmlGenerator.createElement(memXML, "MEMBER_NM", ""); // TODO: 해당부분 기능 미구현 추후개발 OR 삭제 예정
        xmlGenerator.createElement(memXML, "HIE_UNI_NM", ""); // TODO: 해당부분 기능 미구현 추후개발 OR 삭제 예정
      }
      for (CubeMstrEntity cubeMstrEntity : groupDataPut.getCube()) {
        xmlGenerator.createElement(cubeXML);
        xmlGenerator.createElement(cubeXML, "DS_VIEW_ID", cubeMstrEntity.getDsViewId());
        xmlGenerator.createElement(cubeXML, "CUBE_ID", cubeMstrEntity.getCubeId());
      }
      for (DataDsviewCubeDimDTO dataDsviewCubeDimDTO : groupDataPut.getCubeDim()) {
        xmlGenerator.createElement(dimXML);
        xmlGenerator.createElement(dimXML, "DS_VIEW_ID", dataDsviewCubeDimDTO.getDsViewId());
        xmlGenerator.createElement(dimXML, "DIM_UNI_NM", "["+dataDsviewCubeDimDTO.getDimUniNm()+"]");
      }

      XML = xmlGenerator.builder();
      String encodedXML = new String(base64.encode(XML.getBytes(StandardCharsets.UTF_8)));


      GroupAuthDataMstrEntity groupAuthDataMstrEntity = GroupAuthDataMstrEntity.builder()
          .grpId(grpId)
          .dataXml(encodedXML)
          .build();
        
      result.add(groupAuthDataMstrEntity);

    }

    return result;
  }

  private List<GroupDataModel> generateUserDataObject(List<GroupDataDTO> groupDataDTO) throws Exception{

    List<GroupDataModel> result = new ArrayList<>();
    
    for (GroupDataDTO groupData : groupDataDTO) {
    
      GroupDataModel groupDataModel = GroupDataModel.builder()
        .grpId(groupData.getGrpId())
        .datas(UGDataService.dataXmlParsing(groupData.getDataXml()))
        .build();

      result.add(groupDataModel);
    }

    return result;
  }

}

