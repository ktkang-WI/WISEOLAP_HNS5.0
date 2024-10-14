package com.wise.MarketingPlatForm.account.service.group;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.group.GroupMeasureDTO;
import com.wise.MarketingPlatForm.account.entity.GroupAuthDataMstrEntity;
import com.wise.MarketingPlatForm.account.model.groups.measure.MeasureModel;
import com.wise.MarketingPlatForm.account.model.groups.measure.GroupMeasureModel;

@Service
public class GroupMeasureService {

    @Autowired
    private AccountDAO accountDAO;

    private Base64 base64 = new Base64();
    private ObjectMapper objectMapper = new ObjectMapper();

    public List<GroupMeasureModel> getGroupMeasure() throws Exception {

        List<GroupMeasureDTO> userGroupDTO = accountDAO.selectGroupMeasure();

        if (userGroupDTO == null)
            return null;

        List<GroupMeasureModel> groupDataModel = generateUserDataObject(userGroupDTO);

        return groupDataModel;
    }

    public boolean putGroupData(List<GroupMeasureModel> groupDatasetPutDTO) throws Exception {

        List<GroupAuthDataMstrEntity> groupAuthDataMstr = generateGroupAuthMeaObject(groupDatasetPutDTO);

        if (groupAuthDataMstr == null)
            return false;

        boolean result = false;

        if (groupAuthDataMstr.size() == 0)
            return accountDAO.deleteGroupDataAll();

        result = accountDAO.deleteGroupMeasure(groupAuthDataMstr);

        groupAuthDataMstr = groupAuthDataMstr
                .stream()
                .filter(d -> d.getDataXml() != null)
                .collect(Collectors.toList());

        if (groupAuthDataMstr.size() == 0)
            return result;

        result = accountDAO.putGroupMeasure(groupAuthDataMstr);

        return result;
    }

    private List<GroupAuthDataMstrEntity> generateGroupAuthMeaObject(List<GroupMeasureModel> groupDatasetPutDTO)
            throws Exception {
        List<GroupAuthDataMstrEntity> result = new ArrayList<>();

        for (GroupMeasureModel model : groupDatasetPutDTO) {
            int grpId = model.getGrpId();
            List<MeasureModel> datas = model.getDatas();
            String dataStr = objectMapper.writeValueAsString(datas);
            dataStr = base64.encodeBase64String(dataStr.getBytes("UTF-8"));

            GroupAuthDataMstrEntity groupAuthDataMstrEntity = GroupAuthDataMstrEntity.builder()
                    .grpId(grpId)
                    .dataXml(dataStr)
                    .build();

            result.add(groupAuthDataMstrEntity);
        }

        return result;
    }

    private List<GroupMeasureModel> generateUserDataObject(List<GroupMeasureDTO> groupDataDTO) throws Exception {

        List<GroupMeasureModel> result = new ArrayList<>();

        for (GroupMeasureDTO data : groupDataDTO) {
            String json = new String(base64.decode(data.getDataXml().getBytes()), "UTF-8");
            List<MeasureModel> model = objectMapper.readValue(json, new TypeReference<List<MeasureModel>>() {
            });

            GroupMeasureModel groupDataModel = GroupMeasureModel.builder()
                    .grpId(data.getGrpId())
                    .datas(model)
                    .build();

            result.add(groupDataModel);
        }

        return result;
    }

}
