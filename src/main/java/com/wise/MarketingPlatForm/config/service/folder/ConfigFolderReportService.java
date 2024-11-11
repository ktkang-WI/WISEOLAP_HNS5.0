package com.wise.MarketingPlatForm.config.service.folder;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wise.MarketingPlatForm.auth.vo.UserDTO;
import com.wise.MarketingPlatForm.config.dao.ConfigDAO;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderReportDTO;
import com.wise.MarketingPlatForm.dataset.type.DataSetType;

@Service
public class ConfigFolderReportService {

  @Autowired
  ConfigDAO configDao;

  public List<ConfigFolderReportDTO> getConfigFolderReportData() {
    List<ConfigFolderReportDTO> configFolderDTO = configDao.selectConfigFolders();
    // 보고서
    List<ConfigFolderReportDTO> configReportDTO = configDao.selectConfigFolderReport();
    List<ConfigFolderReportDTO> resultDTO = configFolderDTO;
    ObjectMapper objectMapper = new ObjectMapper();
    
    Set<Integer> folderIds = configFolderDTO.stream()
        .map(ConfigFolderReportDTO::getFldId)
        .collect(Collectors.toSet());

        for (ConfigFolderReportDTO reportDto : configReportDTO) {
          if (folderIds.contains(reportDto.getFldId())) {
              try {
                  JSONObject datasets = new JSONObject(objectMapper.readValue(reportDto.getDatasetXml(), Map.class));
                  final JSONArray datasetArray = datasets.getJSONArray("datasets");
                  boolean isCube = false;
                  
                  for (int i = 0; i < datasetArray.length(); i++) {
                      String datasetType = datasetArray.getJSONObject(i).get("datasetType").toString();
                      if (datasetType.equals(DataSetType.CUBE.toString())) {
                          isCube = true;
                          break;
                      }
                  }
                  
                  reportDto.setCube(isCube);
                  resultDTO.add(reportDto);
              } catch (JsonProcessingException e) {
                  e.printStackTrace();
              }
          }
      }

    return resultDTO;
  };

  public List<ConfigFolderReportDTO> getConfigPrivateFolderReportData(int userNo) {
    // 폴더 
    List<ConfigFolderReportDTO> configFolderDTO = configDao.selectConfigPrivateFolders(userNo);
    // 보고서
    List<ConfigFolderReportDTO> configReportDTO = configDao.selectConfigPrivateFolderReport(userNo);
    List<ConfigFolderReportDTO> resultDTO = configReportDTO;
    
    for (ConfigFolderReportDTO folderDto : configFolderDTO) {
      boolean hasItem = false;
      if (configReportDTO.size() == 0) resultDTO.add(folderDto);
      for (ConfigFolderReportDTO reportDto : configReportDTO) {
        if (folderDto.getFldId() == reportDto.getFldId()) {
          hasItem = true;
          break;
        }
      }
      if (!hasItem) {
        resultDTO.add(folderDto);
      }
    }

    return resultDTO;
  };
  public List<UserDTO> getUserList() {

    List<UserDTO> configFolderDTO = configDao.selectUserList();
    
    return configFolderDTO;
  };
  
}

