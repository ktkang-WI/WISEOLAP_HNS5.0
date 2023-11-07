package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.converters;

import com.wise.MarketingPlatForm.report.domain.item.pivot.param.TopBottomParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.AvroConverter;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroTopBottomParam;

public class TopBottomParamConverter implements AvroConverter<TopBottomParam, AvroTopBottomParam> {

    @Override
    public AvroTopBottomParam convert(TopBottomParam unconverted) {
        return new AvroTopBottomParam(unconverted.getDataFieldName(),
                unconverted.getApplyFieldName(), unconverted.getTopBottomType(),
                unconverted.getTopBottomCount(), unconverted.isInPercent(),
                unconverted.isShowOthers());
    }

    @Override
    public TopBottomParam unconvert(AvroTopBottomParam converted) {
        return new TopBottomParam(converted.getDataFieldName(), converted.getApplyFieldName(),
                converted.getTopBottomType(), converted.getTopBottomCount(),
                converted.getInPercent(), converted.getShowOthers());
    }

}
