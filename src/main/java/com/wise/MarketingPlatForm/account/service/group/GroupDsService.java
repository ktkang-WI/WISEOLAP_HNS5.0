package com.wise.MarketingPlatForm.account.service.group;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDsDTO;
import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.account.model.groups.ds.GroupDsModel;
import com.wise.MarketingPlatForm.account.model.user.dataset.UserDatasetModel;
import com.wise.MarketingPlatForm.dataset.entity.DsMstrEntity;

@Service
public class GroupDsService {
  
  @Autowired
  AccountDAO accountDAO;

  public List<GroupDsModel> getGroupDs() {

    List<GroupDsDTO> groupDsDTO = accountDAO.selectGroupDs();

    List<GroupDsModel> groupDsModel = generateGroupDsObject(groupDsDTO);

    return groupDsModel;
  };


  public List<GroupDsModel> generateGroupDsObject(List<GroupDsDTO> groupDsDTO) {
    
    List<GroupDsModel> result = new ArrayList<>();
    List<DsMstrEntity> dsList = new ArrayList<>();
    List<Integer> groupkeys = new ArrayList<>();
    GroupMstrEntity group = null;
    GroupDsModel groupDsModel = null;
    int prevGrpId = 0;
    
    for (GroupDsDTO groupDs : groupDsDTO) {

      int grpId = groupDs.getGrpId();

      if ((prevGrpId != grpId) && prevGrpId != 0) {
        groupDsModel = GroupDsModel.builder()
        .group(group)
        .ds(dsList)
        .build();
        result.add(groupDsModel);
        dsList = new ArrayList<>();
      }

      if (!groupkeys.contains(grpId)) {
        group = GroupMstrEntity.builder()
        .grpId(grpId)
        .grpNm(groupDs.getGrpNm())
        .grpDesc(groupDs.getGrpDesc())
        .build();
        groupkeys.add(grpId);
      }

      DsMstrEntity ds = DsMstrEntity.builder()
        .dsId(groupDs.getDsId())
        .dsNm(groupDs.getDsNm())
        .dbmsType(groupDs.getDbmsType())
        .ownerNm(groupDs.getOwnerNm())
        .ip(groupDs.getIp())
        .dbNm(groupDs.getDbNm())
        .build();


      dsList.add(ds);

      prevGrpId = grpId;
    }

    if (dsList.size() > 0) {
      groupDsModel = GroupDsModel.builder()
        .group(group)
        .ds(dsList)
        .build();
        result.add(groupDsModel);
    }

    return result;
  }

}
