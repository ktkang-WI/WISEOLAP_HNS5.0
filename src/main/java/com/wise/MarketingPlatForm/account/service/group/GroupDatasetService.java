package com.wise.MarketingPlatForm.account.service.group;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDatasetDTO;
import com.wise.MarketingPlatForm.account.entity.FldMstrEntity;
import com.wise.MarketingPlatForm.account.entity.GroupMstrEntity;
import com.wise.MarketingPlatForm.account.model.groups.dataset.GroupDatasetModel;
import com.wise.MarketingPlatForm.account.model.groups.ds.GroupDsModel;

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
    GroupMstrEntity group = null;
    GroupDatasetModel groupDatasetModel = null;
    int prevGroupId = 0;
    
    for (GroupDatasetDTO groupDatasetData : groupDatasetDTO) {

      int grpId = groupDatasetData.getGrpId();

      if ((prevGroupId != grpId) && prevGroupId != 0) {
        groupDatasetModel = GroupDatasetModel.builder()
        .group(group)
        .dataset(datasetList)
        .build();
        result.add(groupDatasetModel);
        datasetList = new ArrayList<>();
      }

      if (!groupkeys.contains(grpId)) {
        group = GroupMstrEntity.builder()
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

    if (datasetList.size() > 0) {
      groupDatasetModel = GroupDatasetModel.builder()
        .group(group)
        .dataset(datasetList)
        .build();
        result.add(groupDatasetModel);
    }

    return result;
  }

}
