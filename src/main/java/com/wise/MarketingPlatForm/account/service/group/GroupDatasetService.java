package com.wise.MarketingPlatForm.account.service.group;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDatasetDTO;
import com.wise.MarketingPlatForm.account.model.groups.dataset.GroupDatasetModel;
import com.wise.MarketingPlatForm.config.entity.FldMstrEntity;

@Service
public class GroupDatasetService {
  
  @Autowired
  private AccountDAO accountDAO;


  public List<GroupDatasetModel> getGroupDataset() {

    List<GroupDatasetDTO> groupDatasetDTO = accountDAO.selectGroupDataset();

    List<GroupDatasetModel> groupDatasetModel = generateGroupDatasetObject(groupDatasetDTO);

    return groupDatasetModel;
  };

  public List<GroupDatasetModel> generateGroupDatasetObject(List<GroupDatasetDTO> groupDatasetDTO) {

    List<GroupDatasetModel> result = new ArrayList<>();
    List<FldMstrEntity> datasetList = new ArrayList<>();
    List<Integer> groupkeys = new ArrayList<>();
    UserGroupDTO group = null;
    GroupDatasetModel groupDatasetModel = null;
    int prevGroupId = 0;
    boolean isThereToSave = false;
    
    for (GroupDatasetDTO groupDatasetData : groupDatasetDTO) {

      int grpId = groupDatasetData.getGrpId();
      boolean lastGroupIdNumber = ((prevGroupId != grpId) && prevGroupId != 0);
      boolean isGroupContained = groupkeys.contains(grpId);

      if (lastGroupIdNumber) {
        groupDatasetModel = GroupDatasetModel.builder()
        .group(group)
        .dataset(datasetList)
        .build();
        result.add(groupDatasetModel);
        datasetList = new ArrayList<>();
      }

      if (!isGroupContained) {
        group = UserGroupDTO.builder()
        .grpId(groupDatasetData.getGrpId())
        .grpNm(groupDatasetData.getGrpNm())
        .grpDesc(groupDatasetData.getGrpDesc())
        .build();
        groupkeys.add(grpId);
      }

      FldMstrEntity dataset = FldMstrEntity.builder()
        .fldId(groupDatasetData.getFldId())
        .fldNm(groupDatasetData.getFldNm())
        .fldParentId(groupDatasetData.getParentFldId())
        .build();


      datasetList.add(dataset);

      prevGroupId = grpId;
    }

    isThereToSave = datasetList.size() > 0;

    if (isThereToSave) {
      groupDatasetModel = GroupDatasetModel.builder()
        .group(group)
        .dataset(datasetList)
        .build();
        result.add(groupDatasetModel);
    }

    return result;
  }

}
