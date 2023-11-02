package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.converters;

import com.wise.MarketingPlatForm.report.domain.item.pivot.param.SortInfoParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.AvroConverter;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSortInfoParam;

public class SortInfoParamConverter implements AvroConverter<SortInfoParam, AvroSortInfoParam> {

    @Override
    public AvroSortInfoParam convert(SortInfoParam unconverted) {
        return new AvroSortInfoParam(unconverted.getSortOrder(), unconverted.getDataField(),
                unconverted.getSortByField());
    }

    @Override
    public SortInfoParam unconvert(AvroSortInfoParam converted) {
        return new SortInfoParam(converted.getSortOrder(), converted.getDataField(),
                converted.getSortByField());
    }

}
