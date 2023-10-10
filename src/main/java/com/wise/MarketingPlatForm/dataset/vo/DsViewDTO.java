package com.wise.MarketingPlatForm.dataset.vo;

import com.wise.MarketingPlatForm.dataset.type.DbmsType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DsViewDTO {
  int dsViewId;
  int dsId;
  String dsViewNm;
  String dsViewDesc;
  String dbNm;
  String ip;
  DbmsType dbmsType;
}
