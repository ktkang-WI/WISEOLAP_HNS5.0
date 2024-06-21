package com.wise.MarketingPlatForm.account.service.user;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserDataDTO;
import com.wise.MarketingPlatForm.account.dto.user.UserDataPutDTO;
import com.wise.MarketingPlatForm.account.entity.UserAuthDataMstrEntity;
import com.wise.MarketingPlatForm.account.model.user.data.UserDataModel;
import com.wise.MarketingPlatForm.account.service.UserGroupDataService;
import com.wise.MarketingPlatForm.dataset.domain.cube.entity.CubeMstrEntity;
import com.wise.MarketingPlatForm.dataset.dto.ds.DataDsviewCubeDimDTO;
import com.wise.MarketingPlatForm.dataset.dto.ds.DatasetDsDsviewCubeDTO;
import com.wise.MarketingPlatForm.utils.XMLGenerator;


@Service
public class UserDataService {

  @Autowired
  private AccountDAO accountDAO;

  private Base64 base64 = new Base64();


  @Autowired
  private UserGroupDataService UGDataService;
  
  public List<UserDataModel> getUserData() throws Exception{

    List<UserDataDTO> userGroupDTO = accountDAO.selectUserData();

    List<UserDataModel> userDataModel = generateUserDataObject(userGroupDTO);

    return userDataModel;
  }

  public boolean putUserData(List<UserDataPutDTO> userDatasetPutDTO) throws Exception{

    List<UserAuthDataMstrEntity> userAuthDataMstr = generateUserAuthDataObject(userDatasetPutDTO);

    if (userAuthDataMstr == null) return false;

    boolean result = false;
  
    result = accountDAO.deleteUserData(userAuthDataMstr);
    result = accountDAO.putUserData(userAuthDataMstr);

    return result;
  }
  
  private List<UserAuthDataMstrEntity> generateUserAuthDataObject(List<UserDataPutDTO> userDatasetPutDTO) throws Exception{
    List<UserAuthDataMstrEntity> result = new ArrayList<>();
    String rootXML = "NewDataSet";
    String memXML = "Auth_Mem";
    String cubeXML = "Auth_Cubes";
    String dimXML = "Auth_Dim";

    for (UserDataPutDTO userDataPut : userDatasetPutDTO) {
      XMLGenerator xmlGenerator = new XMLGenerator(rootXML);
      String XML = null;
      int userNo = userDataPut.getUserNo();
      
      for (DatasetDsDsviewCubeDTO datasetDsDsviewCubeDTO : userDataPut.getDsView()) {
        xmlGenerator.createElement(memXML);
        xmlGenerator.createElement(memXML, "DS_VIEW_ID", datasetDsDsviewCubeDTO.getDsViewId());
        xmlGenerator.createElement(memXML, "DIM_UNI_NM", "["+datasetDsDsviewCubeDTO.getDimUniNm()+"]");
        xmlGenerator.createElement(memXML, "MEMBER_NM", ""); // TODO: 해당부분 기능 미구현 추후개발 OR 삭제 예정
        xmlGenerator.createElement(memXML, "HIE_UNI_NM", ""); // TODO: 해당부분 기능 미구현 추후개발 OR 삭제 예정
      }
      for (CubeMstrEntity cubeMstrEntity : userDataPut.getCube()) {
        xmlGenerator.createElement(cubeXML);
        xmlGenerator.createElement(cubeXML, "DS_VIEW_ID", cubeMstrEntity.getDsViewId());
        xmlGenerator.createElement(cubeXML, "CUBE_ID", cubeMstrEntity.getCubeId());
      }
      for (DataDsviewCubeDimDTO dataDsviewCubeDimDTO : userDataPut.getCubeDim()) {
        xmlGenerator.createElement(dimXML);
        xmlGenerator.createElement(dimXML, "DS_VIEW_ID", dataDsviewCubeDimDTO.getDsViewId());
        xmlGenerator.createElement(dimXML, "DIM_UNI_NM", "["+dataDsviewCubeDimDTO.getDimUniNm()+"]");
      }

      XML = xmlGenerator.builder();
      String encodedXML = new String(base64.encode(XML.getBytes(StandardCharsets.UTF_8)));

      UserAuthDataMstrEntity userAuthDataMstrEntity = UserAuthDataMstrEntity.builder()
          .userNo(userNo)
          .dataXml(encodedXML)
          .build();
        
      result.add(userAuthDataMstrEntity);

    }

    return result;
  }

  private List<UserDataModel> generateUserDataObject(List<UserDataDTO> userDataDTO) throws Exception{

    List<UserDataModel> result = new ArrayList<>();
    
    for (UserDataDTO userData : userDataDTO) {

      UserGroupDTO user = UserGroupDTO.builder()
        .userNo(userData.getUserNo())
        .userId(userData.getUserId())
        .userNm(userData.getUserNm())
        .build();

      UserDataModel userDataModel = UserDataModel.builder()
        .user(user)
        .datas(UGDataService.dataXmlParsing(userData.getDataXml()))
        .build();

      result.add(userDataModel);
    }

    return result;
  }

}


