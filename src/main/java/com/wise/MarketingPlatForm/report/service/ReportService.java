package com.wise.MarketingPlatForm.report.service;

import java.io.StringReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import com.wise.MarketingPlatForm.report.dao.ReportDAO;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
import com.wise.MarketingPlatForm.report.vo.DatasetVO;
import com.wise.MarketingPlatForm.report.vo.FieldVO;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;
import com.wise.MarketingPlatForm.report.vo.ReportOptions;
import com.wise.MarketingPlatForm.report.vo.ReportVO;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ReportService {

  private final ReportDAO reportDAO;

  ReportService(ReportDAO reportDAO) {
    this.reportDAO = reportDAO;
  }

  public ReportMstrDTO getReport(Map<String, String> arguments) {
	List<ReportMstrEntity> temp = reportDAO.selectReport(arguments);
	ReportMstrDTO dto = temp.get(0).toDTO(temp.get(0));
	
	
	
	ReportOptions reportOptions = ReportOptions.builder()
		.order(dto.getReportOrdinal())
		.reportDesc(dto.getReportDesc())
		.reportNm(dto.getReportNm())
		.reportPath(null)
		.build();
	
	ReportVO reports = ReportVO.builder()
			.reportId(dto.getReportId())
			.options(reportOptions)
			.build();
	
//	List<FieldVO> fields = IntStream.range(0, 1).map(() -> {
//		
//	});
//	
//	List<DatasetVO> datasets = IntStream.range(0, 1).map(() -> {
//		
//	});
	return dto;
  }
}