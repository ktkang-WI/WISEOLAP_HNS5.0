package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix;

import java.lang.ref.WeakReference;
import java.util.List;

import com.wise.MarketingPlatForm.report.domain.item.pivot.model.PivotDataAggregation;
import com.wise.MarketingPlatForm.report.domain.item.pivot.model.Paging;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.GroupParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.SortInfoParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.SummaryParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.UdfGroupParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.impl.DefaultSummaryFactoryImpl;

public abstract class SummaryMatrixFactory {

	private static SummaryMatrixFactory theFactory = new DefaultSummaryFactoryImpl();

	protected SummaryMatrixFactory() {
	}

	public static WeakReference<SummaryMatrix> slicePageSummaryMatrix(final SummaryMatrix matrix, final Paging paging, String showRowGrandTotals, String showRowTotals) {
		return theFactory.doSlicePageSummaryMatrix(matrix, paging, showRowGrandTotals, showRowTotals);
	}

	public static WeakReference<SummaryMatrix> createEmptyPageSummaryMatrix(final SummaryMatrix matrix) {
		return theFactory.doCreateEmptyPageSummaryMatrix(matrix);
	}

	public static WeakReference<SummaryMatrix> createSummaryMatrixFromFullyExpandedDataAggregation(
			final PivotDataAggregation dataAggregation, final String cacheKey, final List<GroupParam> rowGroupParams,
			final List<GroupParam> colGroupParams, final List<SummaryParam> summaryParams,
			final List<SortInfoParam> sortInfoParams, final List<UdfGroupParam> udfGroupParams) {
		return theFactory.doCreateSummaryMatrixFromFullyExpandedDataAggregation(dataAggregation, cacheKey,
				rowGroupParams, colGroupParams, summaryParams, sortInfoParams, udfGroupParams);
	}

	abstract public WeakReference<SummaryMatrix> doSlicePageSummaryMatrix(SummaryMatrix matrix, Paging paging, String showRowGrandTotals, String showRowTotals);

	abstract public WeakReference<SummaryMatrix> doCreateEmptyPageSummaryMatrix(final SummaryMatrix matrix);

	abstract public WeakReference<SummaryMatrix> doCreateSummaryMatrixFromFullyExpandedDataAggregation(
			final PivotDataAggregation dataAggregation, final String cacheKey, final List<GroupParam> rowGroupParams,
			final List<GroupParam> colGroupParams, final List<SummaryParam> summaryParams,
			final List<SortInfoParam> sortInfoParams, final List<UdfGroupParam> udfGroupParams);
}
