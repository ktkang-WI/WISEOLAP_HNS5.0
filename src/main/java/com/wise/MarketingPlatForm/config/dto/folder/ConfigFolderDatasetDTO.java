package com.wise.MarketingPlatForm.config.dto.folder;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class ConfigFolderDatasetDTO {
  int fldId;
  String fldNm;
  int parentFldId;
  int fldOridinal;
}
