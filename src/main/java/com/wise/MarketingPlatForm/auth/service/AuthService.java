package com.wise.MarketingPlatForm.auth.service;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import com.wise.MarketingPlatForm.auth.dao.AuthDAO;
import com.wise.MarketingPlatForm.auth.entity.AuthDataEntity;
import com.wise.MarketingPlatForm.auth.entity.UserEntity;
import com.wise.MarketingPlatForm.auth.type.RunMode;
import com.wise.MarketingPlatForm.auth.vo.AuthCubeVO;
import com.wise.MarketingPlatForm.auth.vo.AuthDataDTO;
import com.wise.MarketingPlatForm.auth.vo.AuthDimVO;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;

@Service
public class AuthService {
  AuthDAO authDAO;

  AuthService(AuthDAO authDAO) {
    this.authDAO = authDAO;
  }
  
  public AuthDataDTO getAuthData(String userId) {
    UserDTO user = getUserByIdForAuth(userId);

    AuthDataEntity authDataEntity = authDAO.selectGrpAuthData(user.getGrpId());

    if (authDataEntity.getDataXmlBase64().isEmpty()) {
      authDataEntity = authDAO.selectUserAuthData(user.getUserNo());
    }

    byte[] decodedBytes = Base64.getDecoder().decode(
      authDataEntity.getDataXmlBase64().replaceAll("\\R", ""));
    String dataXml = "";
    try {
      dataXml = new String(decodedBytes, "UTF-8");
    } catch (Exception e) {
      e.printStackTrace();
    }

    AuthDataDTO authData = AuthDataDTO.builder()
      .dataXmlBase64(authDataEntity.getDataXmlBase64())
      .dataXml(dataXml)
      .grpId(user.getGrpId())
      .userNo(user.getUserNo()).build();

    List<AuthDimVO> authDims = new ArrayList<> ();
    List<AuthCubeVO> authCubes = new ArrayList<> ();

    try {
      DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
      DocumentBuilder builder = factory.newDocumentBuilder();
      Document document = builder.parse(new InputSource(new StringReader(dataXml)));

      Element root = document.getDocumentElement();
      NodeList children = root.getChildNodes();

      for (int i = 0; i < children.getLength(); i++) {
        Node node = children.item(i);
        if (node.getNodeType() != Node.ELEMENT_NODE) continue;
        if (node.getNodeName().equals("Auth_Dim")) {
          NodeList authDim = node.getChildNodes();
          int dsViewId = 0;
          String dimUniNm = "";
          

          for (int j = 0; j < authDim.getLength(); j++) {
            if (authDim.item(j).getNodeName().equals("DS_VIEW_ID")) {
              dsViewId = Integer.parseInt(authDim.item(j).getTextContent());
            } else if (authDim.item(j).getNodeName().equals("DIM_UNI_NM")) {
              dimUniNm = authDim.item(j).getTextContent();
            }
          }

          authDims.add(new AuthDimVO(dsViewId, dimUniNm));
        } else if (node.getNodeName().equals("Auth_Cubes")) {
          NodeList authCube = node.getChildNodes();
          int dsViewId = 0;
          int cubeId = 0;
          
          for (int j = 0; j < authCube.getLength(); j++) {
            if (authCube.item(j).getNodeName().equals("DS_VIEW_ID")) {
              dsViewId = Integer.parseInt(authCube.item(j).getTextContent());
            } else if (authCube.item(j).getNodeName().equals("CUBE_ID")) {
              cubeId = Integer.parseInt(authCube.item(j).getTextContent());
            }
          }

          authCubes.add(new AuthCubeVO(dsViewId, cubeId));
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    authData.setAuthDim(authDims);
    authData.setAuthCube(authCubes);

    return authData;
  };

  /**
   * 권한 설정을 위해 사용되는 메서드입니다.
   * 필요없는 정보는 생략한 채 userNo, grpId, userId, userNm, runMode만 리턴합니다.
   * 삭제된 유저의 정보를 조회할 시 NullPointerException이 발생합니다.
   * @param userId
   * @return
   */
  public UserDTO getUserByIdForAuth(String userId) {
    UserEntity entity = authDAO.selectUserById(userId);

    return UserDTO.builder()
      .userId(userId)
      .userNo(entity.getUserNo())
      .grpId(entity.getGrpId())
      .runMode(RunMode.fromString(entity.getRunMode()).get())
      .userNm(entity.getUserNm())
      .build();
  }

  /**
   * 비밀번호를 포함한 유저의 모든 정보를 반환합니다.
   * 삭제된 유저의 정보를 조회할 시 NullPointerException이 발생합니다.
   * @param userId
   * @return
   */
  public UserDTO getUserById(String userId) {
    UserEntity entity = authDAO.selectUserById(userId);

    // TODO: 추후 필요한 정보 있으면 추가
    return UserDTO.builder()
      .userId(userId)
      .userNo(entity.getUserNo())
      .grpId(entity.getGrpId())
      .userDesc(entity.getUserDesc())
      .password(entity.getPassword())
      .runMode(RunMode.fromString(entity.getRunMode()).get())
      .userNm(entity.getUserNm())
      .build();
  }
}
