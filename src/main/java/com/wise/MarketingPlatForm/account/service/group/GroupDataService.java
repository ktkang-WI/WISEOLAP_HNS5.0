package com.wise.MarketingPlatForm.account.service.group;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDataDTO;
import com.wise.MarketingPlatForm.account.model.groups.data.GroupDataModel;
import com.wise.MarketingPlatForm.account.service.UserGroupDataService;

@Service
public class GroupDataService {

  @Autowired
  private AccountDAO accountDAO;

  @Autowired
  private UserGroupDataService UGDataService;

  public List<GroupDataModel> getGroupData() throws Exception{

    List<GroupDataDTO> userGroupDTO = accountDAO.selectGroupData();

    List<GroupDataModel> groupDataModel = generateUserDataObject(userGroupDTO);

    return groupDataModel;
  }

  private List<GroupDataModel> generateUserDataObject(List<GroupDataDTO> groupDataDTO) throws Exception{

    List<GroupDataModel> result = new ArrayList<>();
    
    for (GroupDataDTO groupData : groupDataDTO) {

      UserGroupDTO group = UserGroupDTO.builder()
        .grpId(groupData.getGrpId())
        .grpNm(groupData.getGrpNm())
        .grpDesc(groupData.getGrpDesc())
        .build();

        GroupDataModel groupDataModel = GroupDataModel.builder()
        .group(group)
        .dsViews(UGDataService.dataXmlParsing(groupData.getDataXml()))
        .build();

      result.add(groupDataModel);
    }

    return result;
  }

}

