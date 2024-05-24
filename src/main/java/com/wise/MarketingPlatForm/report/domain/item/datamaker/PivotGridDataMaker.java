package com.wise.MarketingPlatForm.report.domain.item.datamaker;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.wise.MarketingPlatForm.global.context.BeanContext;
import com.wise.MarketingPlatForm.global.diagnos.WDC;
import com.wise.MarketingPlatForm.global.diagnos.WdcTask;
import com.wise.MarketingPlatForm.report.controller.ReportController;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.DataSanitizer;
import com.wise.MarketingPlatForm.report.domain.data.custom.DataPickUpMake;
import com.wise.MarketingPlatForm.report.domain.data.data.Dimension;
import com.wise.MarketingPlatForm.report.domain.data.data.Measure;
import com.wise.MarketingPlatForm.report.domain.data.data.PivotOption;
import com.wise.MarketingPlatForm.report.domain.data.data.TopBottomInfo;
import com.wise.MarketingPlatForm.report.domain.item.ItemDataMaker;
import com.wise.MarketingPlatForm.report.domain.item.pivot.model.Paging;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.PagingParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.SummaryMatrix;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.SummaryMatrixFactory;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.SummaryMatrixProvider;
import com.wise.MarketingPlatForm.report.domain.result.ReportResult;
import com.wise.MarketingPlatForm.report.domain.result.result.CommonResult;

public class PivotGridDataMaker implements ItemDataMaker {
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @Override
    public ReportResult make(DataAggregation dataAggreagtion, List<Map<String, Object>> data) {
        List<Measure> temporaryMeasures = dataAggreagtion.getMeasures();
        List<Measure> measures = dataAggreagtion.getOriginalMeasures();
        List<Dimension> dimensions = dataAggreagtion.getDimensions();
        List<Measure> sortByItems = dataAggreagtion.getSortByItems();
        TopBottomInfo topBottomInfo = dataAggreagtion.getAdHocOption().getTopBottomInfo();

        DataSanitizer sanitizer = new DataSanitizer(data, temporaryMeasures, dimensions, sortByItems);

        List<Measure> allMeasure = new ArrayList<>();

        allMeasure.addAll(measures);
        allMeasure.addAll(sortByItems);
        
        // 데이터 기본 가공
        sanitizer
            .dataFiltering(dataAggreagtion.getFilter())
            .groupBy()
            .topBottom(topBottomInfo)
            .orderBy()
            .columnFiltering(true);


        if (dataAggreagtion.isRemoveNullData()) {
            sanitizer.removeNullData();
        }

        data = sanitizer.getData();

        DataPickUpMake customData = new DataPickUpMake(data);
        List<Map<String, Object>> tempData = customData.executer(dimensions, temporaryMeasures);
        if(tempData != null) {
            data = tempData;
        }

        
        Map<String, Object> info = new HashMap<> ();

        PivotOption pivotOption = dataAggreagtion.getPivotOption();

        try (WdcTask task = WDC.getCurrentTask().startSubtask("pivotSummaryMatrix")) {
            internalPivotSummaryMatrix(dataAggreagtion, pivotOption, data, info);
        }

        CommonResult result = new CommonResult(data, info);

        return result;
    }

    private void internalPivotSummaryMatrix(DataAggregation dataAggregation, PivotOption opt, List<Map<String, Object>> data, Map<String, Object> map) {
        final SummaryMatrixProvider summaryMatrixProvider = BeanContext.get(SummaryMatrixProvider.class);
        final PagingParam pagingParam = opt.getPagingParam();
        final String showRowGrandTotals = opt.getShowRowGrandTotals();
        final String showRowTotals = opt.getShowRowTotals();

        try {
            SummaryMatrix matrix = summaryMatrixProvider.getPivotSummaryMatrix(dataAggregation, opt, data).get();

            if (matrix == null) {
                map.put("matrix", matrix);
                return;
            }

            final Paging paging = new Paging();
            paging.setOffset(pagingParam.getOffset());
            paging.setLimit(pagingParam.getLimit());

            SummaryMatrix pagedMatrix;
            if (pagingParam.getLimit() == 0) {
                pagedMatrix = matrix;
            } else {
                pagedMatrix = SummaryMatrixFactory.slicePageSummaryMatrix(matrix, paging, showRowGrandTotals, showRowTotals).get();
            }
            
            pagedMatrix.setAttributes(matrix.getAttributes());

            Map<String, Object> metaMap = new HashMap<> ();
            Map<String, Object> matrixMap = new HashMap<> ();

            metaMap.put("rowGroupParams", pagedMatrix.getRowSummaryDimension());
            metaMap.put("colGroupParams", pagedMatrix.getColGroupParams());
            metaMap.put("summaryParams", pagedMatrix.getSummaryParams());
            metaMap.put("rowFlattendSummaryDimensions", pagedMatrix.getRowFlattendSummaryDimensions());
            metaMap.put("colFlattendSummaryDimensions", pagedMatrix.getColFlattendSummaryDimensions());

            matrixMap.put("rows", pagedMatrix.getRows());
            matrixMap.put("cols", pagedMatrix.getCols());
            matrixMap.put("cells", pagedMatrix.getSummaryCells());

            map.put("meta", metaMap);
            map.put("paging", paging);
            map.put("matrix", matrixMap);
        } catch (Exception e) {
            logger.error("Failed to process data aggregation.", e);
            map.put("error", e.getStackTrace());
        }
    }
}
