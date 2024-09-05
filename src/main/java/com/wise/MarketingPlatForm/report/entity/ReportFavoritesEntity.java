package com.wise.MarketingPlatForm.report.entity;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReportFavoritesEntity {
  private int favoriteId;
  private int userNo;
  private int reportId;
  private Date createdAt;
  private String fldType;
}
