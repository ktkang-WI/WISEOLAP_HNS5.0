package com.wise.MarketingPlatForm.account.service.user;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.user.UserMeasureDTO;
import com.wise.MarketingPlatForm.account.entity.UserAuthDataMstrEntity;
import com.wise.MarketingPlatForm.account.model.groups.measure.MeasureModel;
import com.wise.MarketingPlatForm.account.model.user.measure.UserMeasureModel;

@Service
public class UserMeasureService {

    @Autowired
    private AccountDAO accountDAO;

    private Base64 base64 = new Base64();
    private ObjectMapper objectMapper = new ObjectMapper();

    public List<UserMeasureModel> getUserMeasure() throws Exception {

        List<UserMeasureDTO> userUserDTO = accountDAO.selectUserMeasure();

        if (userUserDTO == null)
            return null;

        List<UserMeasureModel> userDataModel = generateUserDataObject(userUserDTO);

        return userDataModel;
    }

    public boolean putUserMeasure(List<UserMeasureModel> userDatasetPutDTO) throws Exception {

        List<UserAuthDataMstrEntity> userAuthDataMstr = generateUserAuthMeaObject(userDatasetPutDTO);

        if (userAuthDataMstr == null)
            return false;

        boolean result = false;

        if (userAuthDataMstr.size() == 0)
            return accountDAO.deleteUserDataAll();

        result = accountDAO.deleteUserMeasure(userAuthDataMstr);

        userAuthDataMstr = userAuthDataMstr
                .stream()
                .filter(d -> d.getDataXml() != null)
                .collect(Collectors.toList());

        if (userAuthDataMstr.size() == 0)
            return result;

        result = accountDAO.putUserMeasure(userAuthDataMstr);

        return result;
    }

    private List<UserAuthDataMstrEntity> generateUserAuthMeaObject(List<UserMeasureModel> userDatasetPutDTO)
            throws Exception {
        List<UserAuthDataMstrEntity> result = new ArrayList<>();

        for (UserMeasureModel model : userDatasetPutDTO) {
            int userNo = model.getUserNo();
            List<MeasureModel> datas = model.getDatas();
            String dataStr = objectMapper.writeValueAsString(datas);
            dataStr = base64.encodeBase64String(dataStr.getBytes("UTF-8"));

            UserAuthDataMstrEntity userAuthDataMstrEntity = UserAuthDataMstrEntity.builder()
                    .userNo(userNo)
                    .dataXml(dataStr)
                    .build();

            result.add(userAuthDataMstrEntity);
        }

        return result;
    }

    private List<UserMeasureModel> generateUserDataObject(List<UserMeasureDTO> userDataDTO) throws Exception {

        List<UserMeasureModel> result = new ArrayList<>();

        for (UserMeasureDTO data : userDataDTO) {
            String json = new String(base64.decode(data.getDataXml().getBytes()), "UTF-8");
            List<MeasureModel> model = objectMapper.readValue(json, new TypeReference<List<MeasureModel>>() {
            });

            UserMeasureModel userDataModel = UserMeasureModel.builder()
                    .userNo(data.getUserNo())
                    .datas(model)
                    .build();

            result.add(userDataModel);
        }

        return result;
    }

}
