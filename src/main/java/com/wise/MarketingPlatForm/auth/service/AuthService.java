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

import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.auth.dao.AuthDAO;
import com.wise.MarketingPlatForm.auth.entity.AuthDataEntity;
import com.wise.MarketingPlatForm.auth.entity.UserEntity;
import com.wise.MarketingPlatForm.auth.type.RunMode;
import com.wise.MarketingPlatForm.auth.vo.AuthCubeVO;
import com.wise.MarketingPlatForm.auth.vo.AuthDataDTO;
import com.wise.MarketingPlatForm.auth.vo.AuthDimVO;
import com.wise.MarketingPlatForm.auth.vo.AuthMemVO;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;

@Service
public class AuthService {
    final String defaultXml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n" +
                "<NewDataSet></NewDataSet>";
    AuthDAO authDAO;

    AuthService(AuthDAO authDAO) {
        this.authDAO = authDAO;
    }

    private boolean isEmptyString(String str) {
        return str == null || str.isEmpty();
    }

    public AuthDataDTO getAuthData(String userId) {
        UserDTO user = getUserByIdForAuth(userId);

        AuthDataEntity authDataEntity = authDAO.selectGrpAuthData(user.getGrpId());

        if (authDataEntity == null || isEmptyString(authDataEntity.getDataXmlBase64())) {
            authDataEntity = authDAO.selectUserAuthData(user.getUserNo());

            if (authDataEntity == null || isEmptyString(authDataEntity.getDataXmlBase64())) {
                authDataEntity = new AuthDataEntity(user.getGrpId(), userId, user.getUserNo(), Base64.getEncoder().encodeToString(defaultXml.getBytes()));
            }
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

        List<AuthDimVO> authDims = new ArrayList<>();
        List<AuthCubeVO> authCubes = new ArrayList<>();
        List<AuthMemVO> authMems = new ArrayList<>();

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(new InputSource(new StringReader(dataXml)));

            Element root = document.getDocumentElement();
            NodeList children = root.getChildNodes();

            for (int i = 0; i < children.getLength(); i++) {
                Node node = children.item(i);
                if (node.getNodeType() != Node.ELEMENT_NODE)
                    continue;
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
                } else if (node.getNodeName().equals("Auth_Mem")) {
                    NodeList authMem = node.getChildNodes();
                    int dsViewId = 0;
                    String dimUniNm = "";
                    String hieUniNm = "";
                    String memberNm = "";
                    for (int j = 0; j < authMem.getLength(); j++) {
                        if (authMem.item(j).getNodeName().equals("DS_VIEW_ID")) {
                            dsViewId = Integer.parseInt(authMem.item(j).getTextContent());
                        } else if (authMem.item(j).getNodeName().equals("DIM_UNI_NM")) {
                            dimUniNm = authMem.item(j).getTextContent();
                        } else if (authMem.item(j).getNodeName().equals("HIE_UNI_NM")) {
                            hieUniNm = authMem.item(j).getTextContent();
                        } else if (authMem.item(j).getNodeName().equals("MEMBER_NM")) {
                            memberNm = authMem.item(j).getTextContent();
                        }
                    }
                    authMems.add(new AuthMemVO(dsViewId, dimUniNm, hieUniNm, memberNm));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        authData.setAuthDim(authDims);
        authData.setAuthCube(authCubes);
        authData.setAuthMem(authMems);

        return authData;
    };

    /**
     * 권한 설정을 위해 사용되는 메서드입니다.
     * 필요없는 정보는 생략한 채 userNo, grpId, userId, userNm, runMode만 리턴합니다.
     * 삭제된 유저의 정보를 조회할 시 NullPointerException이 발생합니다.
     * 
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
     * 
     * @param userId
     * @return
     */
    public UserDTO getUserById(String userId) {
        UserEntity entity = authDAO.selectUserById(userId);
        List<String> mdCodes = authDAO.selectMdCode(userId);

        if (entity == null) return null;
        // TODO: 추후 필요한 정보 있으면 추가
        return UserDTO.builder()
                .userId(userId)
                .userNo(entity.getUserNo())
                .grpId(entity.getGrpId())
                .userDesc(entity.getUserDesc())
                .password(entity.getPassword())
                .runMode(RunMode.fromString(entity.getRunMode()).get())
                .userNm(entity.getUserNm())
                .mdCode(String.join(", ", mdCodes))
                .build();
    }

    /**
     * 비밀번호를 포함한 유저의 모든 정보를 반환합니다.
     * 삭제된 유저의 정보를 조회할 시 NullPointerException이 발생합니다.
     * 
     * @param userId
     * @return
     */
    public GroupMstrEntity getUserGroupById(int i) {
        GroupMstrEntity entity = authDAO.selectGroupMstrById(i);

        if (entity == null) return null;
        // TODO: 추후 필요한 정보 있으면 추가
        return entity;
    }
}
