package com.wise.MarketingPlatForm.account.service.group;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wise.MarketingPlatForm.account.dao.AccountDAO;
import com.wise.MarketingPlatForm.account.dto.UserGroupDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDatasetDTO;
import com.wise.MarketingPlatForm.account.dto.group.GroupDatasetPutDTO;
import com.wise.MarketingPlatForm.account.entity.GroupAuthDatasetMstrEntity;
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

  @Transactional
  public boolean putGroupDataset(List<GroupDatasetPutDTO> groupDatasetPutDTO) {

    List<GroupAuthDatasetMstrEntity> groupAuthDatasetMstr = generateGroupAuthDatasetObject(groupDatasetPutDTO);

    if (groupAuthDatasetMstr == null) return false;

    boolean result = false;
  
    result = accountDAO.deleteGroupDataset(groupAuthDatasetMstr);
    result = accountDAO.putGroupDataset(groupAuthDatasetMstr);

    return result;
  };

  private List<GroupAuthDatasetMstrEntity> generateGroupAuthDatasetObject(List<GroupDatasetPutDTO> groupDatasetPutDTO) {
    List<GroupAuthDatasetMstrEntity> result = new ArrayList<>();

    for (GroupDatasetPutDTO groupDatasetPut : groupDatasetPutDTO) {
      int grpId = groupDatasetPut.getGrpId();
      List<Integer> flds = groupDatasetPut.getFldId();
      int fldsSize = flds.size();
      if (fldsSize == 0) {
        GroupAuthDatasetMstrEntity groupAuthDatasetMstrEntity = GroupAuthDatasetMstrEntity.builder()
          .grpId(grpId)
          .fldId(0)
          .build();
          result.add(groupAuthDatasetMstrEntity);

        continue;
      }

      for (Integer fldId : flds) {

        GroupAuthDatasetMstrEntity groupAuthDatasetMstrEntity = GroupAuthDatasetMstrEntity.builder()
          .grpId(grpId)
          .fldId(fldId)
          .build();

          result.add(groupAuthDatasetMstrEntity);

      }

    }

    return result;
  }

  private List<GroupDatasetModel> generateGroupDatasetObject(List<GroupDatasetDTO> groupDatasetDTO) {

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
