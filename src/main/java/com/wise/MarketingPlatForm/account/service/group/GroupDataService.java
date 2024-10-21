package com.wise.MarketingPlatForm.account.service.group;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.CubeDTO;
import com.wise.MarketingPlatForm.account.dto.DsViewDimDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDataDTO;
import com.wise.MarketingPlatForm.account.entity.GroupAuthDataMstrEntity;
import com.wise.MarketingPlatForm.account.model.groups.data.DataModel;
import com.wise.MarketingPlatForm.account.model.groups.data.GroupDataModel;
import com.wise.MarketingPlatForm.account.service.UserGroupDataService;
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

  public boolean putGroupData(List<GroupDataModel> groupDatasetPutDTO) throws Exception{

    List<GroupAuthDataMstrEntity> groupAuthDataMstr = generateGroupAuthDataObject(groupDatasetPutDTO);

    if (groupAuthDataMstr == null) return false;

    boolean result = false;
  
    // if (groupAuthDataMstr.size() == 0) return accountDAO.deleteGroupDataAll();

    result = accountDAO.deleteGroupData(groupAuthDataMstr);

    groupAuthDataMstr = groupAuthDataMstr
    .stream()
    .filter(d -> d.getDataXml() != null)
    .collect(Collectors.toList());

    if (groupAuthDataMstr.size() == 0) return result;

    result = accountDAO.putGroupData(groupAuthDataMstr);

    return result;
  }

  private List<GroupAuthDataMstrEntity> generateGroupAuthDataObject(List<GroupDataModel> groupDatasetPutDTO) throws Exception{
    List<GroupAuthDataMstrEntity> result = new ArrayList<>();
    String rootXML = "NewDataSet";
    // String memXML = "Auth_Mem"; TODO: Member 추후개발 예정
    String cubeXML = "Auth_Cubes";
    String dimXML = "Auth_Dim";

    for (GroupDataModel groupDataPut : groupDatasetPutDTO) {
      XMLGenerator xmlGenerator = new XMLGenerator(rootXML);
      String XML = null;
      int grpId = groupDataPut.getGrpId();
      List<DataModel> datas = groupDataPut.getDatas();
      
      for (DataModel dataModel : datas) {
        for (CubeDTO cube : dataModel.getCubeId()) {
          xmlGenerator.createElement(cubeXML);
          xmlGenerator.createElement(cubeXML, "DS_VIEW_ID", cube.getDsViewId());
          xmlGenerator.createElement(cubeXML, "CUBE_ID", cube.getCubeId());
        }
      }
      for (DataModel dataModel : datas) {
        for (DsViewDimDTO cubeDim : dataModel.getDsViewDim()) {
          xmlGenerator.createElement(dimXML);
          xmlGenerator.createElement(dimXML, "DS_VIEW_ID", cubeDim.getDsViewId());
          xmlGenerator.createElement(dimXML, "DIM_UNI_NM", "["+cubeDim.getDimDimUniNm()+"].[" + cubeDim.getHieUniNm() + "]");
        }
      }
      
      XML = xmlGenerator.builder();
      String encodedXML = new String(base64.encode(XML.getBytes(StandardCharsets.UTF_8)));


      if (datas.size() == 0) {
        encodedXML = null;
      }
      
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

