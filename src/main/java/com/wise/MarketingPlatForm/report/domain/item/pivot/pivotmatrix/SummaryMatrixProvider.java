package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.ref.WeakReference;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wise.MarketingPlatForm.data.map.MapListDataFrame;
import com.wise.MarketingPlatForm.data.QueryResultCacheManager;
import com.wise.MarketingPlatForm.data.file.CacheFileWritingTaskExecutorService;
import com.wise.MarketingPlatForm.data.file.SummaryMatrixFileWriterService;
import com.wise.MarketingPlatForm.global.diagnos.WDC;
import com.wise.MarketingPlatForm.global.diagnos.WdcTask;
import com.wise.MarketingPlatForm.global.util.ServiceTimeoutUtils;
import com.wise.MarketingPlatForm.report.domain.data.DataAggregation;
import com.wise.MarketingPlatForm.report.domain.data.data.PivotOption;
import com.wise.MarketingPlatForm.report.domain.item.pivot.aggregator.DataAggregator;
import com.wise.MarketingPlatForm.report.domain.item.pivot.model.DataFrame;
import com.wise.MarketingPlatForm.report.domain.item.pivot.model.PivotDataAggregation;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.FilterParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.GroupParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.PagingParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.SortInfoParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.SummaryParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.TopBottomParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.UdfGroupParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.impl.SummaryMatrixUtils;
import com.wise.MarketingPlatForm.report.controller.ReportController;

@Service
public class SummaryMatrixProvider {
	private static final Logger logger = LoggerFactory.getLogger(ReportController.class);
	
	@Autowired
    private DataAggregator dataAggregator;
	
	@Autowired
    private QueryResultCacheManager queryResultCacheManager;
    
    @Autowired
    private SummaryMatrixFileWriterService summaryMatrixFileWriterService;
    
    @Autowired
    private CacheFileWritingTaskExecutorService cacheFileWritingTaskExecutorService;
    
	public WeakReference<SummaryMatrix> getPivotSummaryMatrix(final DataAggregation dataAggregation, final PivotOption opt, final List<Map<String, Object>> dataArray) throws Exception {
		final String argsInfo = opt.generateCacheKey(dataAggregation);
		final String cacheKey = DigestUtils.sha256Hex(argsInfo);
        final PagingParam pagingParam = opt.getPagingParam();

		final WeakReference<SummaryMatrix> cachedSummaryMatrix = getPivotSummaryMatrixFromCache(cacheKey, pagingParam);

		if (cachedSummaryMatrix != null && cachedSummaryMatrix.get() != null) {
			return cachedSummaryMatrix;
		}
		
		ServiceTimeoutUtils.checkServiceTimeout();
		
		final FilterParam filterParam = opt.getFilterParam();
		final List<UdfGroupParam> udfGroupParams = opt.getUdfGroupParams();
		final List<GroupParam> groupParams = opt.getGroupParams();
		final int groupParamCount = groupParams.size();
		final List<SummaryParam> groupSummaryParams = opt.getGroupSummaryParams();
		final List<SummaryParam> totalSummaryParams = opt.getTotalSummaryParams();
		final List<SortInfoParam> sortInfoParams = opt.getSortInfoParams();
		final List<TopBottomParam> topBottomParams = opt.getTopBottomParams();
		
		final List<GroupParam> rowGroupParams = pagingParam.getRowGroupParams();
		final int rowGroupParamCount = rowGroupParams.size();
		final List<GroupParam> colGroupParams = new ArrayList<>();

		boolean isFullyExpandedGroups = true;

		for (int i = 0; i < groupParamCount; i++) {
			final GroupParam groupParam = groupParams.get(i);
			if (i < rowGroupParamCount) {
				final GroupParam rowGroupParam = rowGroupParams.get(i);
				if (groupParam.getKey() != null && !StringUtils.equals(groupParam.getKey(), rowGroupParam.getKey())) {
					isFullyExpandedGroups = false;
					break;
				}
			} else {
				colGroupParams.add(groupParam);
			}
		}

		if (!isFullyExpandedGroups) {
			return null;
		}

		ServiceTimeoutUtils.checkServiceTimeout();
		
		final List<String> colNames = dataArray != null && dataArray.size() > 0
				? new ArrayList<>(dataArray.get(0).keySet())
				: Collections.emptyList();

		final DataFrame dataFrame = new MapListDataFrame(dataArray, colNames.toArray(new String[colNames.size()]));
		
		final WeakReference<PivotDataAggregation> aggregation;
		
		try(WdcTask task = WDC.getCurrentTask().startSubtask("summaryMatrixProivder.createDataAggregation")){
			aggregation = dataAggregator.createDataAggregation(dataFrame, filterParam, udfGroupParams,
				groupParams, groupSummaryParams, totalSummaryParams, null, sortInfoParams, topBottomParams, true);
		}

		ServiceTimeoutUtils.checkServiceTimeout();
		
		final WeakReference<SummaryMatrix> matrix;
		
		try(WdcTask task = WDC.getCurrentTask().startSubtask("summaryMatrixProivder.createSummaryMatrix")){
			matrix = SummaryMatrixFactory.createSummaryMatrixFromFullyExpandedDataAggregation(
				aggregation.get(), cacheKey, rowGroupParams, colGroupParams, groupSummaryParams, sortInfoParams, udfGroupParams);
			task.setAttribute("rows", matrix.get().getRows());
			task.setAttribute("rowGroups", matrix.get().getRowGroupParams());
		}
		
		ServiceTimeoutUtils.checkServiceTimeout();
		
        // TODO: 캐시 추후 적용
		if (matrix.get() != null) {
			putPivotSummaryMatrixToCache(cacheKey, matrix.get(), pagingParam);
		}

		return matrix;
	}

	public WeakReference<SummaryMatrix> getPivotSummaryMatrixFromCache(final String cacheKey, final PagingParam pagingParam) {
		WeakReference<SummaryMatrix> matrix = null;

		final int beginIndex = pagingParam.getOffset();
		final int endIndex = beginIndex + pagingParam.getLimit();
		final int rowCountInPart1 = summaryMatrixFileWriterService.getRowCountInPart1();
		final boolean part2FileRequired = endIndex >= rowCountInPart1;

		try {
			if (!part2FileRequired) {
				matrix = new WeakReference<SummaryMatrix>((SummaryMatrix) queryResultCacheManager.getSummaryMatrixCache(cacheKey));
			}

			if (matrix != null) {
				return matrix;
			}

			final String relDirPath = DateFormatUtils.format(new Date(), "yyyyMMdd");
			final File cacheFilePart1 = summaryMatrixFileWriterService.getSummaryMatrixFile(cacheKey, relDirPath);

			SummaryMatrix mainMatrix = null;
			long fileLengthM = cacheFilePart1.length()/1024/1024;
			if (cacheFilePart1 != null && cacheFilePart1.isFile() && fileLengthM < 100) {
				mainMatrix = readSummaryMatrixFromFile(cacheFilePart1);
				queryResultCacheManager.putSummaryMatrixCache(cacheKey, mainMatrix);

				if (!part2FileRequired) {
					matrix = new WeakReference<SummaryMatrix>(mainMatrix);
				}
				else {
					final SummaryMatrix mergeableMatrix = readSummaryMatrixFromFile(cacheFilePart1);
					final File cacheFilePart2 = summaryMatrixFileWriterService.getSummaryMatrixFileForPart2(cacheKey, relDirPath);
					
					SummaryCell[][] extraCells = null;

					if (cacheFilePart2 != null && cacheFilePart2.isFile()) {
						try {
							extraCells = readSummaryCellsFromFile(cacheFilePart2, mergeableMatrix.getCols());
						} catch (Exception ex) {
							logger.error("Failed to read extraCells from part2 file.", ex);
						}
					}
					
					if (extraCells != null) {
						final SummaryCell[][] originalCells = mergeableMatrix.getSummaryCells();
	
						final int maxRows = rowCountInPart1 + extraCells.length;
	
						for (int i = rowCountInPart1; i < maxRows; i++) {
							final SummaryCell[] originalCellRow = originalCells[i];
							final SummaryCell[] extraCellRow = extraCells[i - rowCountInPart1];
							System.arraycopy(extraCellRow, 0, originalCellRow, 0, extraCellRow.length);
						}
					}

					matrix = new WeakReference<SummaryMatrix>(mergeableMatrix);
				}
			}
		} catch (Exception e) {
			logger.error("Faile dto get summary matrix from the cache.", e);
		}

		return matrix;
	}

	private SummaryMatrix readSummaryMatrixFromFile(final File file) throws IOException {
		try (FileInputStream fis = new FileInputStream(file);
				InputStreamReader isr = new InputStreamReader(fis, StandardCharsets.UTF_8);
				BufferedReader br = new BufferedReader(isr)) {
			ObjectMapper readObjectMapper = new ObjectMapper();
			final JsonNode matrixNode = readObjectMapper.readTree(br);
			return SummaryMatrixUtils.readSummaryMatrixFromJson(readObjectMapper, matrixNode);
		}
	}

	private SummaryCell[][] readSummaryCellsFromFile(final File file, final int cols) throws IOException {
		try (FileInputStream fis = new FileInputStream(file);
				BufferedInputStream bis = new BufferedInputStream(fis)) {
			return AvroSummaryMatrixUtils.deserializeSummaryCellRowsFromAvroData(bis);
		}
	}

	private void putPivotSummaryMatrixToCache(final String cacheKey, final SummaryMatrix matrix, final PagingParam pagingParam) {
		final int beginIndex = pagingParam.getOffset();
		final int endIndex = beginIndex + pagingParam.getLimit();
		final int rowCountInPart1 = summaryMatrixFileWriterService.getRowCountInPart1();
		final boolean part2FileRequired = endIndex >= rowCountInPart1;

		try {
			if (!part2FileRequired) {
				queryResultCacheManager.putSummaryMatrixCache(cacheKey, matrix);
			}

			final String relDirPath = DateFormatUtils.format(new Date(), "yyyyMMdd");
			final File cacheFile = summaryMatrixFileWriterService.getSummaryMatrixFile(cacheKey, relDirPath);

			if (cacheFile == null || !cacheFile.isFile()) {
				cacheFileWritingTaskExecutorService.execute(new Runnable() {
					@Override
					public void run() {
						try {
							if(cacheFile == null || !cacheFile.isFile()) {
								summaryMatrixFileWriterService.writeSummaryMatrix(cacheKey, relDirPath, matrix);
							}
						} catch (Exception e) {
							logger.error("Failed to save summary matrix to the cache file.", e);
						}
					}
				});
				
			}
		}catch (Exception e) {
			logger.error("Failed to submit the task to cache summary matrix to the cache file.", e);
		}
	}
	
}
