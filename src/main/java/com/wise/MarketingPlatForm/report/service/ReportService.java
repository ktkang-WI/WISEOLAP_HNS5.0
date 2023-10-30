package com.wise.MarketingPlatForm.report.service;

import org.springframework.stereotype.Service;

import com.wise.MarketingPlatForm.dataset.service.DatasetService;
import com.wise.MarketingPlatForm.dataset.vo.DsMstrDTO;
import com.wise.MarketingPlatForm.global.config.MartConfig;
import com.wise.MarketingPlatForm.mart.dao.MartDAO;
import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.factory.ItemDataMakerFactory;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.store.QueryGenerator;
import com.wise.MarketingPlatForm.report.domain.store.factory.QueryGeneratorFactory;

@Service
public class ReportService {
    private final MartConfig martConfig;
    private final MartDAO martDAO;
    private final DatasetService datasetService;

    ReportService(MartConfig martConfig, MartDAO martDAO, DatasetService datasetService) {
        this.martConfig = martConfig;
        this.martDAO = martDAO;
        this.datasetService = datasetService;
    }

    public ReportResult getItemData(DataAggregation dataAggreagtion) {
        ReportResult result;

        QueryGeneratorFactory queryGeneratorFactory = new QueryGeneratorFactory();
        QueryGenerator queryGenerator = queryGeneratorFactory.getDataStore(dataAggreagtion.getDataset().getDsType());

        // TODO: 주제 영역일 경우 다르게 처리 현재는 쿼리 직접 입력만.
        // 추후 쿼리 queryGenerator에 구현
        DsMstrDTO dsMstrDTO = datasetService.getDataSource(dataAggreagtion.getDataset().getDsId());

        // TODO: 추후 DB 암호화 적용시 복호화 로직.
        // try {
        // Aes256Cipher aes256 = Aes256Cipher.getInstance();
        // String pw = aes256.AES_Decode(dsMstrDTO.getPassword());
        // dsMstrDTO.setPassword(pw);
        // } catch (Exception e) {
        // e.printStackTrace();
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
