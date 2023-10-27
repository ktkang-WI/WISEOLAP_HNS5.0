package com.wise.MarketingPlatForm.report.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;

@Mapper
public interface ReportDAO {
    public List<ReportMstrEntity> selectReport(Map<String, String> arguments);
}