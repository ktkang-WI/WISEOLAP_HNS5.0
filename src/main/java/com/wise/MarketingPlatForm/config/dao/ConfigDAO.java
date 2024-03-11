package com.wise.MarketingPlatForm.config.dao;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;
import com.wise.MarketingPlatForm.config.dto.GeneralDTO;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderDTO;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderDatasetDTO;
import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderReportDTO;
import com.wise.MarketingPlatForm.config.entity.ConfigMstrEntity;
import com.wise.MarketingPlatForm.config.entity.FldMstrEntity;
import com.wise.MarketingPlatForm.config.entity.WbConfigMstrEntity;

@Mapper
public interface ConfigDAO {
  public GeneralDTO selectGeneralData();
  public boolean updateConfig(ConfigMstrEntity configMstr);
  public boolean updateWbConfig(WbConfigMstrEntity wbConfigMstr);
  public List<ConfigFolderDTO> selectConfigFolderGroup();
  public List<ConfigFolderDatasetDTO> selectConfigFolderDataset();
  public Map<String, String> getSpreadLicense();
  public List<FldMstrEntity> selectConfigFolder();
  public List<ConfigFolderReportDTO> selectConfigFolderReport();
  public boolean createConfigFolder(FldMstrEntity fldMstrEntity);
  public boolean updateConfigFolder(FldMstrEntity fldMstrEntity);
  public boolean deleteConfigFolder(FldMstrEntity fldMstrEntity);
}
