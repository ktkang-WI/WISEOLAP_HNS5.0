package com.wise.MarketingPlatForm.report.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.global.config.MartConfig;
import com.wise.MarketingPlatForm.global.util.XMLParser;
import com.wise.MarketingPlatForm.mart.dao.MartDAO;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.report.dao.ReportDAO;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.factory.ItemDataMakerFactory;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.store.QueryGenerator;
import com.wise.MarketingPlatForm.report.domain.store.factory.QueryGeneratorFactory;
import com.wise.MarketingPlatForm.report.entity.ReportMstrEntity;
import com.wise.MarketingPlatForm.report.vo.DatasetVO;
import com.wise.MarketingPlatForm.report.vo.MetaVO;
import com.wise.MarketingPlatForm.report.vo.ReportMstrDTO;
import com.wise.MarketingPlatForm.report.vo.ReportOptionsVO;
import com.wise.MarketingPlatForm.report.vo.ReportVO;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ReportService {

  private final ReportDAO reportDAO;
  private final MartConfig martConfig;
  private final MartDAO martDAO;
  private final DatasetService datasetService;
  private final XMLParser xmlParser;

  ReportService(ReportDAO reportDAO, MartConfig martConfig, MartDAO martDAO, DatasetService datasetService, XMLParser xmlParser) {
    this.reportDAO = reportDAO;
    this.martConfig = martConfig;
    this.martDAO = martDAO;
    this.datasetService = datasetService;
    this.xmlParser = xmlParser;
  }

  public MetaVO getReport(String reportId, String userId) {
	ReportMstrEntity temp = reportDAO.selectReport(reportId);
	ReportMstrDTO dto = temp.toDTO(temp);
	
	MetaVO metaVO =  MetaVO.builder().build();
	
	// report
	ReportOptionsVO reportOptions = ReportOptionsVO.builder()
		.order(dto.getReportOrdinal())
		.reportDesc(dto.getReportDesc())
		.reportNm(dto.getReportNm())
		.reportPath(null)
		.build();
	ReportVO reports = ReportVO.builder()
			.reportId(dto.getReportId())
			.options(reportOptions)
			.build();
	metaVO.getReports().put(dto.getReportId(), new ArrayList<ReportVO>() {{
		add(reports);
	}});
	
	// dataset
	List<DatasetVO> datasetVO = xmlParser.datasetParser(dto.getDatasetXml(), userId);
	metaVO.getDatasets().put(dto.getReportId(), datasetVO);
	
	// layout
	metaVO = xmlParser.layoutParser(dto.getReportId(), metaVO, dto.getLayoutXml());

	return metaVO;
  }

  public ReportResult getItemData(DataAggregation dataAggreagtion) {
    ReportResult result;

    QueryGeneratorFactory queryGeneratorFactory = new QueryGeneratorFactory();
    QueryGenerator queryGenerator = queryGeneratorFactory.getDataStore(dataAggreagtion.getDataset().getDsType());

    // TODO: 주제 영역일 경우 다르게 처리 현재는 쿼리 직접 입력만.
    //       추후 쿼리 queryGenerator에 구현
    DsMstrDTO dsMstrDTO = datasetService.getDataSource(dataAggreagtion.getDataset().getDsId());

    // TODO: 추후 DB 암호화 적용시 복호화 로직.
    // try {
    //   Aes256Cipher aes256 = Aes256Cipher.getInstance();
    //   String pw = aes256.AES_Decode(dsMstrDTO.getPassword());
    //   dsMstrDTO.setPassword(pw);
    // } catch (Exception e) {
    //   e.printStackTrace();
    // }
	    
	  martConfig.setMartDataSource(dsMstrDTO);

    String query = queryGenerator.getQuery(dataAggreagtion);
    
    MartResultDTO martResultDTO = martDAO.select(query);
    ItemDataMakerFactory itemDataMakerFactory = new ItemDataMakerFactory();
    ItemDataMaker itemDataMaker = itemDataMakerFactory.getItemDataMaker(dataAggreagtion.getItemType());
  
    result = itemDataMaker.make(dataAggreagtion, martResultDTO.getRowData());
    
    return result;

  }
}

