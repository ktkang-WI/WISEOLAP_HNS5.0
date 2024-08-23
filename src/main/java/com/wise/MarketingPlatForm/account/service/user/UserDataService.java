package com.wise.MarketingPlatForm.account.service.user;

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
import com.wise.MarketingPlatForm.account.dto.user.UserDataDTO;
import com.wise.MarketingPlatForm.account.entity.UserAuthDataMstrEntity;
import com.wise.MarketingPlatForm.account.model.groups.data.DataModel;
import com.wise.MarketingPlatForm.account.model.user.data.UserDataModel;
import com.wise.MarketingPlatForm.account.service.UserGroupDataService;
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

  public boolean putUserData(List<UserDataModel> userDatasetPutDTO) throws Exception{

    List<UserAuthDataMstrEntity> userAuthDataMstr = generateUserAuthDataObject(userDatasetPutDTO);

    if (userAuthDataMstr == null) return false;

    boolean result = false;

    if (userAuthDataMstr.size() == 0) return accountDAO.deleteUserDataAll();

    result = accountDAO.deleteUserData(userAuthDataMstr);

    userAuthDataMstr = userAuthDataMstr
    .stream()
    .filter(d -> d.getDataXml() != null)
    .collect(Collectors.toList());

    if (userAuthDataMstr.size() == 0) return result;

    result = accountDAO.putUserData(userAuthDataMstr);
    
    return result;
  }
  
  private List<UserAuthDataMstrEntity> generateUserAuthDataObject(List<UserDataModel> userDatasetPutDTO) throws Exception{
    List<UserAuthDataMstrEntity> result = new ArrayList<>();
    String rootXML = "NewDataSet";
    // String memXML = "Auth_Mem";
    String cubeXML = "Auth_Cubes";
    String dimXML = "Auth_Dim";

    for (UserDataModel userDataPut : userDatasetPutDTO) {
      XMLGenerator xmlGenerator = new XMLGenerator(rootXML);
      String XML = null;
      int userNo = userDataPut.getUserNo();
      List<DataModel> datas = userDataPut.getDatas();
      
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

      UserDataModel userDataModel = UserDataModel.builder()
        .userNo(userData.getUserNo())
        .datas(UGDataService.dataXmlParsing(userData.getDataXml()))
        .build();

      result.add(userDataModel);
    }

    return result;
  }

}


