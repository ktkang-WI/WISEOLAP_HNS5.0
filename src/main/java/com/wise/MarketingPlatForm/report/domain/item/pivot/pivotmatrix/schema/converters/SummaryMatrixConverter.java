package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.converters;

import java.util.Collections;

import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.SummaryMatrix;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.impl.DefaultSummaryMatrixImpl;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.AvroConverter;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryMatrix;

public class SummaryMatrixConverter implements AvroConverter<SummaryMatrix, AvroSummaryMatrix> {

    private GroupParamConverter groupParamConverter = new GroupParamConverter();
    private SummaryParamConverter summaryParamConverter = new SummaryParamConverter();
    private SummaryDimensionConverter summaryDimensionConverter = new SummaryDimensionConverter();
    private SummaryCellConverter summaryCellConverter = new SummaryCellConverter();

    @Override
    public AvroSummaryMatrix convert(SummaryMatrix unconverted) {
        return new AvroSummaryMatrix(
                SummaryConverterUtils.convertObjectList(groupParamConverter,
                        unconverted.getRowGroupParams()),
                SummaryConverterUtils.convertObjectList(groupParamConverter,
                        unconverted.getColGroupParams()),
                SummaryConverterUtils.convertObjectList(summaryParamConverter,
                        unconverted.getSummaryParams()),
                summaryDimensionConverter.convert(unconverted.getRowSummaryDimension()),
                summaryDimensionConverter.convert(unconverted.getColSummaryDimension()),
                Collections.emptyList(), Collections.emptyList(), unconverted.getRows(),
                unconverted.getCols(), SummaryConverterUtils.summaryCellsToAvroSummaryCells(
                        summaryCellConverter, unconverted.getSummaryCells()));
    }

    @Override
    public SummaryMatrix unconvert(AvroSummaryMatrix converted) {
        final DefaultSummaryMatrixImpl matrix = new DefaultSummaryMatrixImpl(
                SummaryConverterUtils.unconvertAvroObjectList(groupParamConverter,
                        converted.getRowGroupParams()),
                SummaryConverterUtils.unconvertAvroObjectList(groupParamConverter,
                        converted.getColGroupParams()),
                SummaryConverterUtils.unconvertAvroObjectList(summaryParamConverter,
                        converted.getSummaryParams()),
                summaryDimensionConverter.unconvert(converted.getRowSummaryDimension()),
                summaryDimensionConverter.unconvert(converted.getColSummaryDimension()));
        matrix.setSummaryCells(SummaryConverterUtils
                .avroSummaryCellsToSummaryCells(summaryCellConverter, converted.getCells()));
        return matrix;
    }

}
