package com.wise.MarketingPlatForm.config.dto.config;

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
public class MenuDTO {
  boolean tabAdhoc;
  boolean tabDashboard;
  boolean tabSpreadSheet;
  boolean tabDataset;
  boolean tabConfig;
  boolean tabDatasetViewer;
  boolean tabPopUpAdhoc;
  boolean tabPopUpDashboard;
  boolean tabPopUpSpreadSheet;
  boolean tabPopUpConfig;
  boolean tabPopUpDatasetViewer;
  boolean menuAuth;
  boolean cubeData;
  boolean lookQuery;
  boolean reportHistory;
  boolean searchReport;
  boolean newDatasetByCube;
  boolean newDatasetByDs;
  boolean newDatasetByCrossDomainJoin;
  boolean newDatasetByQuery;
  boolean newDatasetBySingleTable;
  boolean userDataUpload;
  boolean originalDataset;
  boolean officeVisible;
  boolean officeXlsx;
  boolean officeXls;
  boolean officeDoc;
  boolean officePpt;
  boolean hancomVisible;
  boolean hancomHwp;
  boolean hancomCell;
  boolean hancomShow;
  boolean etcVisible;
  boolean etcImg;
  boolean etcHtml;
  boolean etcPpt;
}
