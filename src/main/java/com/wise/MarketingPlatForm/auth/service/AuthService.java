package com.wise.MarketingPlatForm.auth.service;

import java.io.StringReader;
import java.io.UnsupportedEncodingException;
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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.account.model.groups.measure.MeasureModel;
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
    final String defaultJson = "[]";
    ObjectMapper objectMapper = new ObjectMapper();
    AuthDAO authDAO;

    AuthService(AuthDAO authDAO) {
        this.authDAO = authDAO;
    }

    private boolean isEmptyString(String str) {
        return str == null || str.isEmpty();
    }

    private String decodeString (String str, String type) {
        byte[] decodedBytes = Base64.getDecoder().decode(
            str.replaceAll("\\R", ""));
        String dataXml = type.equals("xml") ? defaultXml : defaultJson;

        if (isEmptyString(str)) {
            return dataXml;
        }

        try {
            dataXml = new String(decodedBytes, "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
        }

        return dataXml;
    }

    public AuthDataDTO getAuthData(String userId) {
        UserDTO user = getUserByIdForAuth(userId);

        AuthDataEntity grpDataEntity = authDAO.selectGrpAuthData(user.getGrpId());
        AuthDataEntity userDataEntity = authDAO.selectUserAuthData(user.getUserNo());
        
        AuthDataEntity grpMeaEntity = authDAO.selectGrpAuthMeasure(user.getGrpId());
        AuthDataEntity userMeaEntity = authDAO.selectUserAuthMeasure(user.getUserNo());
        
        String grpXml = grpDataEntity == null ? "" : grpDataEntity.getDataXmlBase64();
        String userXml = userDataEntity == null ? "" : userDataEntity.getDataXmlBase64(); 

        AuthDataDTO authGrpData = AuthDataDTO.builder()
                .dataXmlBase64(grpXml)
                .dataXml(decodeString(grpXml, "xml"))
                .grpId(user.getGrpId())
                .userNo(user.getUserNo()).build();

        AuthDataDTO authUserData = AuthDataDTO.builder()
                .dataXmlBase64(userXml)
                .dataXml(decodeString(userXml, "xml"))
                .grpId(user.getGrpId())
                .userNo(user.getUserNo()).build();

        List<AuthDimVO> authDims = new ArrayList<>();
        List<AuthCubeVO> authCubes = new ArrayList<>();
        List<AuthMemVO> authMems = new ArrayList<>();
        List<MeasureModel> authMeas = new ArrayList<>();

        try {
            String grpJson = grpMeaEntity == null ? "" : grpMeaEntity.getDataXmlBase64();
            String userJson = userMeaEntity == null ? "" : userMeaEntity.getDataXmlBase64();
            String grpStr = decodeString(grpJson, "json");
            String userStr = decodeString(userJson, "json");
            authMeas = objectMapper.readValue(grpStr,
                new TypeReference<List<MeasureModel>>() {});
            authMeas.addAll(objectMapper.readValue(userStr,
            new TypeReference<List<MeasureModel>>() {}));
        } catch (JsonProcessingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        applyAuth(authDims, authCubes, authMems, authGrpData.getDataXml());
        applyAuth(authDims, authCubes, authMems, authUserData.getDataXml());

        AuthDataDTO authData = AuthDataDTO.builder()
        .grpId(user.getGrpId())
        .userNo(user.getUserNo()).build();
    
        authData.setAuthDim(authDims);
        authData.setAuthCube(authCubes);
        authData.setAuthMem(authMems);
        authData.setAuthMea(authMeas);

        return authData;
    };

    void applyAuth(List<AuthDimVO> authDims,  List<AuthCubeVO> authCubes, List<AuthMemVO> authMems, String dataXml) {
        
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
    }

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

        String mdCode = "";

        if (mdCodes != null) {
            mdCode = String.join(", ", mdCodes);
        }

        if (entity == null) return null;
        // TODO: 추후 필요한 정보 있으면 추가
        return UserDTO.builder()
                .userId(userId)
                .userNo(entity.getUserNo())
                .grpId(entity.getGrpId())
                .userDesc(entity.getUserDesc())
                .password(entity.getPassword())
                .runMode(RunMode.fromString(entity.getRunMode()).get())
                .pwChangeDt(entity.getPwChangeDt())
                .userNm(entity.getUserNm())
                .mdCode(mdCode)
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
