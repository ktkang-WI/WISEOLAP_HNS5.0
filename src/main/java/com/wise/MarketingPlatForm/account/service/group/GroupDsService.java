package com.wise.MarketingPlatForm.account.service.group;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDsDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDsPutDTO;
import com.wise.MarketingPlatForm.account.entity.GroupAuthDsMstrEntity;
import com.wise.MarketingPlatForm.account.model.groups.ds.GroupDsModel;

@Service
public class GroupDsService {
  
  @Autowired
  AccountDAO accountDAO;

  public List<GroupDsModel> getGroupDs() {

    List<GroupDsDTO> groupDsDTO = accountDAO.selectGroupDs();

    if (groupDsDTO == null) return null;

    List<GroupDsModel> groupDsModel = generateGroupDsObject(groupDsDTO);

    return groupDsModel;
  };

  @Transactional
  public boolean putGroupDs(List<GroupDsPutDTO> groupDsPutDTO) {

    List<GroupAuthDsMstrEntity> groupAuthDsMstr = generateGroupAuthDsObject(groupDsPutDTO);

    if (groupAuthDsMstr == null) return false;

    boolean result = false;
    // if (groupAuthDsMstr.size() == 0) {
    //   result = accountDAO.deleteGroupDsAll();
    // } else {
      result = accountDAO.deleteGroupDs(groupDsPutDTO);
      result = accountDAO.putGroupDs(groupAuthDsMstr);
    // }

    return result;
  };

  public List<GroupAuthDsMstrEntity> generateGroupAuthDsObject(List<GroupDsPutDTO> groupDsPutDTO) {
    List<GroupAuthDsMstrEntity> result = new ArrayList<>();

    for (GroupDsPutDTO groupdsPut : groupDsPutDTO) {
      int grpId = groupdsPut.getGrpId();
      List<Integer> dss = groupdsPut.getDsIds();
      int dsSize = dss.size();

      if (dsSize == 0) {
        GroupAuthDsMstrEntity groupAuthDsMstrEntity = GroupAuthDsMstrEntity.builder()
          .grpId(grpId)
          .dsId(0)
          .build();

          result.add(groupAuthDsMstrEntity);

        continue;
      }

      for (Integer dsId : groupdsPut.getDsIds()) {

        GroupAuthDsMstrEntity groupAuthDsMstrEntity = GroupAuthDsMstrEntity.builder()
          .grpId(grpId)
          .dsId(dsId)
          .build();

          result.add(groupAuthDsMstrEntity);

      }

    }

    return result;
  }

  public List<GroupDsModel> generateGroupDsObject(List<GroupDsDTO> groupDsDTO) {
    
    List<GroupDsModel> result = new ArrayList<>();
    List<Integer> dsList = new ArrayList<>();
    List<Integer> groupkeys = new ArrayList<>();
    Integer group = 0;
    GroupDsModel groupDsModel = null;
    int prevGroupId = 0;
    boolean isThereToSave = false;

    for (GroupDsDTO groupDs : groupDsDTO) {

      int grpId = groupDs.getGrpId();
      boolean lastGroupIdNumber = ((prevGroupId != grpId) && prevGroupId != 0);
      boolean isGroupContained = groupkeys.contains(grpId);

      if (lastGroupIdNumber) {
        groupDsModel = GroupDsModel.builder()
        .grpId(group)
        .dsIds(dsList)
        .build();
        result.add(groupDsModel);
        dsList = new ArrayList<>();
      }

      if (!isGroupContained) {
        group = grpId;
        groupkeys.add(grpId);
      }

      dsList.add(groupDs.getDsId());

      prevGroupId = grpId;
    }

    isThereToSave = dsList.size() > 0;

    if (isThereToSave) {
      groupDsModel = GroupDsModel.builder()
        .grpId(group)
        .dsIds(dsList)
        .build();
        result.add(groupDsModel);
    }

    return result;
  }

}
