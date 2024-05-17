package com.wise.MarketingPlatForm.config.dto.folder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfigFolderDatasetDTO {
  int fldId;
  String fldNm;
  int parentFldId;
  int fldOridinal;
}
