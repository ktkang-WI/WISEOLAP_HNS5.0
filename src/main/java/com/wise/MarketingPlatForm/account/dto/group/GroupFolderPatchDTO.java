package com.wise.MarketingPlatForm.account.dto.group;

import java.util.List;

import com.wise.MarketingPlatForm.config.dto.folder.ConfigFolderDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupFolderPatchDTO {
  int grpId;
  List<ConfigFolderDTO> fldIds;
}
